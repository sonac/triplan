db.createUser({
  user: "triplan",
  pwd: "pwd",
  roles: [
    {
      role: "readWrite",
      db: "triplan",
    },
  ],
});
