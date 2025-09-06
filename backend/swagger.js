const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Publisher's Library Hub API",
      version: "1.0.0",
      description: "API documentation for Publisher's Library Hub",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "https://publisher-s-library-hub-1.onrender.com",
        description: "Production server",
      },
      {
        "url": "http://ec2-16-170-203-248.eu-north-1.compute.amazonaws.com:3000",
        "description": "AWS EC2 Instance"
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
        },
      },
      schemas: {
        Book: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            title: {
              type: "string",
            },
            author: {
              type: "string",
            },
            description: {
              type: "string",
            },
            created_by: {
              type: "integer",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: [
    "./routes/*.js", // Path to your route files for Swagger annotations
  ],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
