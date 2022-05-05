import chalk from "chalk";

import { db } from "./../server/mongoClient.js";
import { ERROR } from "../models/blueprint/chalk.js";

export async function getAll(req, res) {
  const token = req.header("Authorization").slice(7);

  try {
    await db.collection("sessions").updateOne(
      {
        token: token,
      },
      {
        $set: {
          active: true,
          last_login: new Date(),
        },
      }
    );
    const transactions = await db.collection("transactions").find().toArray();
    res.send(transactions);
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    return res.status(500).send({
      message: "Internal error while getting transactions",
      detail: err,
    });
  }
}
