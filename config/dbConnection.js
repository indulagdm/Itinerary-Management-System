import { connect, disconnect } from "mongoose";

let dbConnect;

const connectDB = async () => {
  try {
    dbConnect = await connect("mongodb://localhost:27017/itinerary");
    console.log(
      `Database connected. Host --> ${dbConnect.connection.host} Database --> ${dbConnect.connection.name}`
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const disConnectDB = async () => {
  try {
    if (dbConnect) {
      dbConnect = await disconnect();
      console.log("Database disconnected.");
    }
  } catch (error) {
    console.error(error.message);
  }
};

export { connectDB, disConnectDB };
