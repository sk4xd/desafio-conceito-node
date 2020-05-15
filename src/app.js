const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateUrlRepository(request, response, next) {
  const urlGit = "github.com";
  const { url } = request.body;
  if (url)
    if (!url.includes(urlGit)) {
      return response.status(400).json({ message: "Invalid URL." });
    }
  next();
}

function validateRepositoryFormat(request, response, next) {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (likes) {
    return response.status(400).json({
      likes: repositories[repositoryIndex].likes,
    });
  }

  if (
    typeof title !== "string" ||
    typeof url !== "string" ||
    typeof techs !== "object"
  ) {
    return response.status(400).json({ message: "Wrong request format." });
  }
  next();
}

function validateId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ message: "Invalid format ID." });
  }
  next();
}

app.use("/repositories/:id", validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  // TODO
  return response.status(200).json(repositories);
});

app.post(
  "/repositories",
  validateUrlRepository,
  validateRepositoryFormat,
  (request, response) => {
    // TODO
    const { title, url, techs } = request.body;

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0,
    };

    repositories.push(repository);

    return response.json(repository);
  }
);

app.put(
  "/repositories/:id",
  validateUrlRepository,
  validateRepositoryFormat,
  (request, response) => {
    // TODO
    const { id } = request.params;
    const { title, url, techs, likes } = request.body;
    const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

    if (repositoryIndex < 0) {
      return response
        .status(400)
        .json({ message: "Repository does not exists." });
    }

    if (likes) {
      return response.send({
        likes: repositories[repositoryIndex].likes,
      });
    }

    repositories[repositoryIndex].title = title;
    repositories[repositoryIndex].url = url;
    repositories[repositoryIndex].techs = techs;

    return response.status(200).json(repositories[repositoryIndex]);
  }
);

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ message: "Repository does not exists." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ message: "Repository does not exists." });
  }

  repositories[repositoryIndex].likes++;

  return response
    .status(200)
    .json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
