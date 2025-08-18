const request = require("supertest");
const { app, connectDB, client } = require("../app"); // Import app, connectDB, and client

jest.setTimeout(10000); // 10 seconds
