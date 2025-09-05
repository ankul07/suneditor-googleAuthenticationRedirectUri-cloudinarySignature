const sendToken = (user, statusCode, res) => {
  const token = user.getAccessToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // sameSite: "none",
    // secure: true,
  };

  res.status(statusCode).cookie("suneditortoken", token, options).json({
    success: true,
    data: user,
    message: "user Login Successfully",
  });
};

export default sendToken;
