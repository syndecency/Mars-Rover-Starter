class Rover {
  constructor(position) {
    this.position = position;
    this.mode = "NORMAL";
    this.generatorWatts = 110;
  }
  receiveMessage(message) {
    let roverResponse = [];
    for (let command of message.commands) {
      if (command.commandType === "STATUS_CHECK") {
        let statusObj = {
          completed: true,
          roverStatus: {
            position: this.position,
            generatorWatts: this.generatorWatts,
            mode: this.mode,
          },
        };
        roverResponse.push(statusObj);
      } else if (command.commandType === "MODE_CHANGE") {
        if (command.value === "LOW_POWER" || command.value === "NORMAL") {
          this.mode = command.value;
          roverResponse.push({ completed: true });
        } else {
          roverResponse.push({ completed: false });
        }
      } else if (command.commandType === "MOVE") {
        if (this.mode === "LOW_POWER") {
          roverResponse.push({ completed: false });
        } else if (this.mode === "NORMAL") {
          this.position = command.value;
          roverResponse.push({ completed: true });
        }
      }
    }

    return {
      message: message.name,
      results: roverResponse,
    };
  }
}

module.exports = Rover;
