const allow_origins = [
  "https://app.swaggerhub.com/apis/YAHGCONCEPT/b-log_api/1.0.0",
  "http://localhost:3000",
];
const corsOptions = {
  credentials: true,
  origin: (origin: any, callback: any) => {
    if (allow_origins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};
export default corsOptions;
