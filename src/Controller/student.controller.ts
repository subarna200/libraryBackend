import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../Service/SendMail";
import cloudinary from "../../config/cloudinary.config";
const prisma = new PrismaClient();
const fs = require("fs");
const deleteResources = async (filePath: any) => {
  await fs.unlink(filePath, (err: any) => {
    if (err) {
      console.log(err);
    }
  });
};
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students: any = await prisma.students.findMany({
      orderBy: {
        Student_Id: "desc",
      },
    });

    if (students.length > 0) {
      res.status(200).json({
        status: true,
        data: students,
        message: "Data Fetched Successfully",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Unable to find students",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { Academics, Email, First_Name, Last_Name } = req.body;
    const students: any = await prisma.students.create({
      data: {
        First_Name: First_Name.trim(),
        Last_Name: Last_Name.trim(),
        Email,
        Academics,
      },
    });
    res.status(200).json({
      status: true,
      data: students,
      message: "Student Registered Successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const editStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Academics, Email, First_Name, Last_Name } = req.body;
    const student = await prisma.students.update({
      where: {
        Student_Id: Number(id),
      },
      data: {
        First_Name,
        Last_Name,
        Email,
        Academics,
      },
    });
    res.status(200).json({
      status: true,
      data: student,
      message: "Student Details Updated Successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.fineTransaction.deleteMany({
      where: {
        BookTransaction: {
          Student: {
            Student_Id: Number(id),
          },
        },
      },
    });
    await prisma.bookTransaction.deleteMany({
      where: {
        Student: {
          Student_Id: Number(id),
        },
      },
    });
    const student: any = await prisma.students.findUnique({
      where: {
        Student_Id: Number(id),
      },
    });
    const { photo_public_id } = student;
    await cloudinary.v2.uploader.destroy(photo_public_id);
    await prisma.students.delete({
      where: {
        Student_Id: Number(id),
      },
    });

    res.status(200).json({
      status: true,
      message: "Student Details has been deleted Successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const verifyStudent = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const isStudentFound = await prisma.students.findUnique({
      where: {
        Email: email,
      },
    });
    if (isStudentFound && isStudentFound.isEmailVerified === 0) {
      const otpToken = `${Math.floor(1000 + Math.random() * 9000)}`;
      const updateStudentWithOtp = await prisma.students.update({
        where: {
          Student_Id: Number(isStudentFound.Student_Id),
        },
        data: {
          OTP: Number(otpToken),
          OTP_EXPIRY: (Date.now() + 10 * 60 * 1000).toString(),
        },
      });
      if (updateStudentWithOtp) {
        try {
          await sendEmail({
            email,
            subject: "Verify your Account - " + updateStudentWithOtp.First_Name,
            message: `<html>
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; background-color: #f2f2f2; padding: 20px; color: #333; margin: 0;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 20px;">
                    <h1 style="text-align: center; color: #007bff; margin-bottom: 20px;">Activate Your Account</h1>
                    <p style="font-size: 16px; margin-bottom: 20px; line-height: 1.8;">
                      Dear ${updateStudentWithOtp.First_Name},<br>
                      You are receiving this email because you have requested to activate your account.<br>
                      Your OTP token is: <strong><span style="color: #007bff;">${updateStudentWithOtp.OTP}</span></strong><br>
                      Your token will expire in 10 minutes.<br><br>
                      Best Regards,<br>
                      Aroma School
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 0 0 8px 8px;">
                    <p style="font-style: italic; color: #555;">- Aroma School</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            `,
          });
          res.status(200).json({
            status: true,
            data: updateStudentWithOtp,
            message: "OTP has been sent successfully",
          });
        } catch (error: any) {
          res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      } else {
        res.status(500).json({
          status: false,
          message: "System can't generate OTP",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "Student Not Found Or Already Activated",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { otpToken, email, id } = req.body;
    const isOTPValid = await prisma.students.findUnique({
      where: {
        Student_Id: Number(id),
        AND: {
          Email: email,
          OTP: Number(otpToken),
          OTP_EXPIRY: {
            gte: Date.now().toString(),
          },
        },
      },
    });
    if (isOTPValid) {
      const changeOtpAEXP = await prisma.students.update({
        where: {
          Student_Id: Number(id),
        },
        data: {
          OTP: null,
          OTP_EXPIRY: null,
        },
      });
      if (changeOtpAEXP) {
        res.status(200).json({
          status: true,
          message: "Otp Verified Successfully",
        });
      }
    } else {
      res.status(401).json({
        status: false,
        message: "Incorrect OTP or OTP expired",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: "Otp verification failed",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const newPassword = async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUND)
    );
    const updatedUser = await prisma.students.update({
      where: {
        Student_Id: Number(id),
      },
      data: {
        Password: hashedPassword,
        isEmailVerified: 1,
      },
    });
    if (updatedUser) {
      res.status(200).json({
        status: true,
        message: "User Verified Successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const processLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isStudentValid: any = await prisma.students.findUnique({
      where: {
        Email: email,
      },
    });
    if (isStudentValid.Password !== null) {
      const isPasswordValid = await bcrypt.compare(
        password,
        isStudentValid.Password
      );
      if (isPasswordValid) {
        const secretKey: any = process.env.JWT_SECRET_KEY;
        const jwtToken = jwt.sign(
          { ...isStudentValid, Role: "student" },
          secretKey,
          {
            expiresIn: "24h",
          }
        );
        res.status(200).json({
          status: true,
          jwtToken,
          data: isStudentValid,
          message: "Student Logged In Successfully",
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Wrong Credentials",
        });
      }
    } else {
      res.status(401).json({
        status: false,
        message: "Wrong Credentials",
      });
    }
  } catch (error: any) {
    res.status(401).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const StudentPassAvatarChange = async (req: Request, res: Response) => {
  try {
    const { newPassword, currentPassword, id, isPhotoChanged } = req.body;
    const uploadedPhoto: any = req.file?.path;
    const user: any = await prisma.students.findUnique({
      where: {
        Student_Id: Number(id),
      },
    });
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.Password
    );
    if (isCurrentPasswordValid) {
      const hashedPassword = await bcrypt.hash(
        newPassword,
        Number(process.env.BCRYPT_SALT_ROUND)
      );
      if (isPhotoChanged) {
        if (user.photo_public_id !== null) {
          await cloudinary.v2.uploader.destroy(user.photo_public_id);
        }
        const newPhoto = await cloudinary.v2.uploader.upload(uploadedPhoto, {
          gravity: "face", // Use 'face' gravity to focus on the detected face
          width: 300,
          height: 300,
          crop: "thumb", // You can use 'thumb' for face-based cropping
        });
        deleteResources(uploadedPhoto);
        const updatedUser = await prisma.students.update({
          where: {
            Student_Id: Number(id),
          },
          data: {
            Password: hashedPassword,
            photo: newPhoto.secure_url,
            photo_public_id: newPhoto.public_id,
          },
        });
        res.status(200).json({
          status: true,
          data: updatedUser,
          message: "Students Details Updated Successfully",
        });
      } else {
        const updatedUser = await prisma.students.update({
          where: {
            Student_Id: Number(id),
          },
          data: {
            Password: hashedPassword,
          },
        });
        res.status(200).json({
          status: true,
          data: updatedUser,
          message: "Student Details Updated Successfully",
        });
      }
    } else {
      res.status(401).json({
        status: false,
        message: "Current Password doesn't match",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const userProfilePicUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const uploadedPhoto: any = req.file?.path;
    const user: any = await prisma.students.findUnique({
      where: {
        Student_Id: Number(id),
      },
    });
    if (user.photo_public_id !== null) {
      await cloudinary.v2.uploader.destroy(user.photo_public_id);
    }
    const newPhoto = await cloudinary.v2.uploader.upload(uploadedPhoto, {
      gravity: "face", // Use 'face' gravity to focus on the detected face
      width: 300,
      height: 300,
      crop: "thumb", // You can use 'thumb' for face-based cropping
    });
    deleteResources(uploadedPhoto);
    const updatedUser = await prisma.students.update({
      where: {
        Student_Id: Number(id),
      },
      data: {
        photo: newPhoto.secure_url,
        photo_public_id: newPhoto.public_id,
      },
    });
    res.status(200).json({
      status: true,
      data: updatedUser,
      message: "Student Details Updated Successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const sendOTPPRESET = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const isStudentFound = await prisma.students.findUnique({
      where: {
        Email: email,
      },
    });
    if (isStudentFound && isStudentFound.isEmailVerified === 1) {
      const otpToken = `${Math.floor(1000 + Math.random() * 9000)}`;
      const updateStudentWithOtp = await prisma.students.update({
        where: {
          Student_Id: Number(isStudentFound.Student_Id),
        },
        data: {
          OTP: Number(otpToken),
          OTP_EXPIRY: (Date.now() + 10 * 60 * 1000).toString(),
        },
      });
      if (updateStudentWithOtp) {
        try {
          await sendEmail({
            email,
            subject:
              "Passowrd Reset Token - " + updateStudentWithOtp.First_Name,
            message: `<html>
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; background-color: #f2f2f2; padding: 20px; color: #333; margin: 0;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 20px;">
                    <h1 style="text-align: center; color: #007bff; margin-bottom: 20px;">Activate Your Account</h1>
                    <p style="font-size: 16px; margin-bottom: 20px; line-height: 1.8;">
                      Dear ${updateStudentWithOtp.First_Name},<br>
                      You are receiving this email because you have requested to reset your password.<br>
                      Your OTP token is: <strong><span style="color: #007bff;">${updateStudentWithOtp.OTP}</span></strong><br>
                      Your token will expire in 10 minutes.<br><br>
                      Best Regards,<br>
                      Aroma School
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 0 0 8px 8px;">
                    <p style="font-style: italic; color: #555;">- Aroma School</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            `,
          });
          res.status(200).json({
            status: true,
            data: updateStudentWithOtp,
            message: "OTP has been sent successfully",
          });
        } catch (error: any) {
          res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      } else {
        res.status(500).json({
          status: false,
          message: "System can't generate OTP",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "Student Not Found or not Activated",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const newPasswordReq = async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUND)
    );
    const updatedUser = await prisma.students.update({
      where: {
        Student_Id: Number(id),
      },
      data: {
        Password: hashedPassword,
      },
    });
    if (updatedUser) {
      res.status(200).json({
        status: true,
        message: "Password Changed Successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};
