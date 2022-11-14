export const rawBodyHandler = (req, res, next) => {
  try {
    req.rawBody = "";
    // req.setEncoding("utf8");
    console.log("webhook middleware");
    req
      .on("data", (chunk) => {
        console.log("receiving webhook data");
        req.rawBody += chunk;
      })
      .on("end", () => {
        console.log("webhook data received..",);
        next();
      });
    // next();
    console.log("rawBodyHandler is working");
  } catch (err) {
    console.log("rawBodyHandler Error", err);
  }
};
