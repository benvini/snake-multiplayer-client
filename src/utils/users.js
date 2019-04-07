class Users {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    if (!this.isUserExists(user.id)) {
      this.users.push(user);
    }
  }

  isUserExists(userId) {
    let isExists = false;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === userId) {
        isExists = true;
      }
    }
    return isExists;
  }

  updateUser(user) {
    const userToUpdate = this.getUser(user.id);
    if (userToUpdate) {
      this.removeUser(userToUpdate.id);
      this.addUser(user);
    }
  }
  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(user => user.id !== id);
    }
  }
  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }
}

module.exports = { Users };
