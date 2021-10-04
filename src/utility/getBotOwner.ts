function getBotOwner(): Promise<string> {
  return new Promise((resolve) => {
    resolve(process.env.OWNER_ID);
  });
}

export default getBotOwner;
