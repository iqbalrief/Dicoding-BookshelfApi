const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
    insertedAt,
    finished,
  };

  if (name !== undefined && readPage <= pageCount) books.push(newBooks);
 const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }  

  if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
}

if (isSuccess) {
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
}

const response = h.response({
  status: 'error',
  message: 'Buku gagal ditambahkan',
});
response.code(500);
return response;
};

const getAllBookHandler = (request, h) => {
  const result = books.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
  const response = h.response(
    {
      status: 'success',
      data:
      {
        books: result,
      },
    },
  );
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const book = books.filter((b) => b.id === id)[0];
 
 if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
const { id } = request.params;
const {
  name,
  year,
  author,
  summary,
  publisher,
  reading,
  readPage,
  pageCount,
} = request.payload;
const finished = pageCount === readPage;
const updatedAt = new Date().toISOString();

const index = books.findIndex((book) => book.id === id);

if (index === -1) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
}

if (readPage > pageCount) {
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
  });
  response.code(400);
  return response;
}

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    reading,
    readPage,
    updatedAt,
    pageCount,
    finished,
  };

  return {
    status: 'success',
    message: 'Buku berhasil diperbarui',
  };
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const index = books.findIndex((book) => book.id === id);
 
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
 
 const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = { 
                  addBookHandler, 
                  getAllBookHandler, 
                  getBookByIdHandler, 
                  editBookByIdHandler, 
                  deleteBookByIdHandler,
                };
