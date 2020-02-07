import * as request from "superagent";

// // load .env file into process.env
// require("dotenv").config();

const { GRAPHQL_API_URL } = process.env;

export async function getUser(token: string) {
  const ME = `
    {
      me {
        email
        name
        companies {
          name
          siret
          address
        }
      }
    }
  `;

  const res = await request
    .post(GRAPHQL_API_URL)
    .set("Authorization", `Bearer ${token}`)
    .set("Accept", "application/json")
    .send({ query: ME });
  return res.body.data.me;
}

export async function getForms(token: string) {
  const FORMS = `{
    forms {
      status
    }
  }`;

  const res = await request
    .post(GRAPHQL_API_URL)
    .set("Authorization", `Bearer ${token}`)
    .set("Accept", "application/json")
    .send({ query: FORMS });

  return res.body.data.forms;
}
