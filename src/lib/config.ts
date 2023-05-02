const tryGet = (key: string) => {
  if (!process.env[key]) throw new Error(`Missing envvar ${key}`);
  return process.env[key]!;
};

export const config = {
  jwtSecret: tryGet('JWT_SECRET'),
};