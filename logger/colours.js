const conClrs = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

export const parseMsgAndColour = (msg) => {
  msg = msg.replace("INFO", `${conClrs.FgGreen}INFO${conClrs.Reset}`);
  msg = msg.replace(/(APP|HTTP|CORS)/, `${conClrs.FgYellow}$1${conClrs.Reset}`);
  msg = msg.replace("ERROR", `${conClrs.FgRed}ERROR${conClrs.Reset}`);
  msg = msg.replace("WARN", `${conClrs.FgYellow}WARN${conClrs.Reset}`);
  msg = msg.replace("DEBUG", `${conClrs.FgBlue}DEBUG${conClrs.Reset}`);
  msg = msg.replace(
    /SESSION-ID - \[(.*)\]/,
    `SESSION-ID - [${conClrs.FgYellow}${conClrs.Underscore}$1${conClrs.Reset}]`
  );
  msg = msg.replace(/(http.*)/, `${conClrs.FgBlue}$1${conClrs.Reset}`);
  msg = msg.replace("RES-HEADERS", `${conClrs.FgMagenta}RES-HEADERS${conClrs.Reset}`);
  msg = msg.replace("REQ-HEADERS", `${conClrs.FgRed}REQ-HEADERS${conClrs.Reset}`);
  msg = msg.replace(
    /\/(api\/dict|api\/rndletters\/:size|dict|join|login|logout|rndletters\/:size)/,
    `${conClrs.FgCyan}$1${conClrs.Reset}`
  );

  return msg;
};
