const Rover = require("../rover.js");
const Message = require("../message.js");
const Command = require("../command.js");

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

describe("Rover class", function () {
  it("constructor sets position and default values for mode and generatorWatts", function () {
    let rover = new Rover(12345);
    expect(rover.position).toBe(12345);
    expect(rover.mode).toBe("NORMAL");
    expect(rover.generatorWatts).toBe(110);
  });

  it("response returned by receiveMessage contains the name of the message", function () {
    let message = new Message("messageTestName", "commands");
    let rover = new Rover(12345);
    expect(rover.receiveMessage(message).message).toBe(message.name);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let commands = [new Command("MODE_CHANGE"), new Command("STATUS_CHECK")];
    let message = new Message("messageTestName", commands);
    let rover = new Rover(12345);
    let roverRespArr = rover.receiveMessage(message);
    expect(roverRespArr.results.length).toBe(2);
  });

  it("responds correctly to the status check command", function () {
    let commands = [new Command("STATUS_CHECK")];
    let message = new Message("messageTestName", commands);
    let rover = new Rover(12345);
    expect(rover.receiveMessage(message).results).toEqual([
      {
        completed: true,
        roverStatus: {
          position: 12345,
          mode: "NORMAL",
          generatorWatts: 110,
        },
      },
    ]);
  });

  it("respondes correctly to the mode change command", function () {
    let commands = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("messageTestName", commands);
    let rover = new Rover(12345);
    let roverResponse = rover.receiveMessage(message);
    expect(rover.mode).toEqual("LOW_POWER");
    expect(roverResponse.results).toEqual([{ completed: true }]);
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let commands = [new Command("MOVE", 54321)];
    let message = new Message("messageTestName", commands);
    let rover = new Rover(12345);
    rover.mode = "LOW_POWER";
    let roverResponse = rover.receiveMessage(message);
    expect(roverResponse.results).toEqual([{ completed: false }]);
    expect(rover.position).toEqual(12345);
  });

  it("responds with the position for the move command", function () {
    let commands = [new Command("MOVE", 54321)];
    let message = new Message("messageTestName", commands);
    let rover = new Rover(12345);
    let roverResponse = rover.receiveMessage(message);
    expect(rover.position).toEqual(54321);
  });
});
