import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books: any = await prisma.books.findMany({
      orderBy: {
        Book_Id: "desc",
      },
    });
    const data: any = await Promise.all(
      books.map(async (book: any) => {
        const qtyBorrowed = await prisma.bookTransaction.findMany({
          where: {
            Book_Id: book.Book_Id,
            AND: {
              Status: "Issued",
            },
          },
        });
        const remainingQty = book.Quantity - qtyBorrowed.length;
        const newObject = { ...book, Quantity_Remaining: remainingQty };
        return newObject;
      })
    );
    if (books.length > 0) {
      res.status(200).json({
        status: true,
        data,
        message: "Data Fetched Successfully",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Unable to find books",
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

export const addBook = async (req: Request, res: Response) => {
  try {
    const { Book_Name, Author_Name, Publication, Published_Date, Quantity } =
      req.body;
    const book: any = await prisma.books.create({
      data: {
        Book_Name,
        Author_Name,
        Publication,
        Published_Date,
        Quantity: Number(Quantity),
      },
    });
    res.status(200).json({
      status: true,
      data: book,
      message: "Book Added Successfully",
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

export const editBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Book_Name, Author_Name, Publication, Published_Date, Quantity } =
      req.body;
    const book = await prisma.books.update({
      where: {
        Book_Id: Number(id),
      },
      data: {
        Book_Name,
        Author_Name,
        Publication,
        Published_Date,
        Quantity: Number(Quantity),
      },
    });
    res.status(200).json({
      status: true,
      data: book,
      message: "Book Details Updated Successfully",
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

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.fineTransaction.deleteMany({
      where: {
        BookTransaction: {
          Book: {
            Book_Id: Number(id),
          },
        },
      },
    });
    await prisma.bookTransaction.deleteMany({
      where: {
        Book_Id: Number(id),
      },
    });
    await prisma.books.delete({
      where: {
        Book_Id: Number(id),
      },
    });
    res.status(200).json({
      status: true,
      message: "Book details has been deleted successfully",
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
