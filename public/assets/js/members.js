/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get('/api/user_data').then((data) => {
    $('.member-name').text(data.username);
    // console.log(data);
    const userid = data.id;
    // console.log(userid, 'user id');
    sessionStorage.setItem('id', JSON.stringify(userid));
    // cass the game schedule and passes user ID ID
    // eslint-disable-next-line no-use-before-define
    callGameSchedule(userid);
  });
});
/* eslint-disable eol-last */
/* eslint-disable no-undef */
// const mapDiv = $('#map');
// const SearchBtn = $('#searchBtn');

// const portsmouth = {
//   lat: 43.071568,
//   lng: -70.762245,
//   name: 'Portsmouth Park',
// };
// const allLocations = [portsmouth];

// function initMap() {
//   const newHampshire = {
//     lat: 44.0,
//     lng: -71.5,
//   };
//   const map = new google.maps.Map(document.getElementById('map'), {
//     center: newHampshire,
//     zoom: 4,
//   });

//   allLocations.forEach((location) => {
//     // eslint-disable-next-line no-unused-vars
//     const marker = new google.maps.Marker({
//       position: {
//         lat: location.lat,
//         lng: location.lng,
//       },
//       map,
//       title: location.name,
//     });
//     // will call marker when we establish what we want to show
//   });
// }
// Handles the dropdown logic
// $(document).ready(() => {
//   $('select').formSelect();
// });

$(document).ready(() => {
  $('.collapsible').collapsible();
  $('.dropdown-trigger').dropdown();
  $('select').formSelect();
  $('.findGame').on('click', () => {
    // eslint-disable-next-line no-use-before-define
    searchAllGames();
  });

  // SearchBtn.on('click', () => {
  //   initMap();
  //   mapDiv.removeClass('.hideMap');
  // });
});
const searchAllGames = () => {
  axios.get('/api/games').then((games) => {
    console.log(games);
    console.log(games.data);
    games.data.forEach((game) => {
      console.log(game);

      // eslint-disable-next-line no-use-before-define
      const checkGameStatus = checkMinRequiredPlayers(
        game.GameType.minPlayers,
        game.GameType.maxPlayers,
        game.GameType.neededToPlay,
        game.numOfPlayersSignedUp
      );
      let gameStatIcon;
      if (checkGameStatus === true) {
        gameStatIcon = 'check_box';
        gameStatIconColor = 'green';
      } else {
        gameStatIcon = 'hourglass_empty';
        gameStatIconColor = 'yellow accent-4';
      }
      console.log(checkGameStatus);
      const $table = $('#find-schedule-table');
      let imageCardPath = './assets/images/';
      imageCardPath = `${imageCardPath}${game.GameType.gameTypesName}.jpg`;
      $table.append(`<tr>
      <td><div class = "container containerimg"><div class="centered"><img src="${imageCardPath}" id="tablePic"><span>${game.GameType.gameTypesName}</span></div></td>
      <td>${game.updatedAt}</td>
      <td>${game.Location.title}</td>
      <td>${game.numOfPlayersSignedUp}</td>
      <td>${game.GameType.minPlayers}</td>
      <td><a class="btn waves-effect waves-light ${gameStatIconColor} id="iconColor""><i class="material-icons id="iconColor">${gameStatIcon}</i></a></td>
      <td><a class="btn waves-effect waves-light green"><i class="material-icons">add</i></a></td>
    </tr>`);
    });
  }).catch((err) => {
    console.log(err);
  });
};

// get all the games
// eslint-disable-next-line no-undef
const callGameSchedule = (userid) => {
  // console.log(userid, 'inside pass game schedule');
  axios.get(`/api/user_schedule/${userid}`).then((schedule) => {
    // code goes here
    console.log(schedule);
    console.log(schedule.data);
    // console.log(schedule.data.Games[0].GameType.gameTypesName);

    schedule.data.Games.forEach((game) => {
      console.log(game);
      // eslint-disable-next-line no-use-before-define
      const checkGameStatus = checkMinRequiredPlayers(
        game.GameType.minPlayers,
        game.GameType.maxPlayers,
        game.GameType.neededToPlay,
        game.numOfPlayersSignedUp
      );
      let gameStatIcon;
      if (checkGameStatus === true) {
        gameStatIcon = 'check_box';
        gameStatIconColor = 'green';
      } else {
        gameStatIcon = 'hourglass_empty';
        gameStatIconColor = 'yellow accent-4';
      }
      console.log(checkGameStatus);
      const $table = $('#schedule-table tbody');
      // const $rowCardTable = $('#rowCardAppend');
      let imageCardPath = './assets/images/';
      imageCardPath = `${imageCardPath}${game.GameType.gameTypesName}.jpg`;
      $table.append(`<tr>
      
      <td><div class = "container containerimg"><div class="centered"><img src="${imageCardPath}" id="tablePic"><span>${game.GameType.gameTypesName}</span></div></td>
      <td>${game.updatedAt}</td>
      <td>${game.Location.title}</td>
      <td>${game.numOfPlayersSignedUp}</td>
      <td>${game.GameType.minPlayers}</td>
      <td><a class="btn waves-effect waves-light ${gameStatIconColor} id="iconColor""><i class="material-icons id="iconColor">${gameStatIcon}</i></a></td>
      <td><a class="btn waves-effect waves-light red darken-4"><i class="material-icons">delete</i></a></td>
    </tr>`);
    });
  }).catch((err) => {
    console.log(err);
  });
};
// Checks if the minium number of players is met
const checkMinRequiredPlayers = (
  minPlayers,
  maxPlayers,
  boolean,
  numOfPlayerSignedUp
) => {
  let gameOn;
  if (boolean === true && numOfPlayerSignedUp === maxPlayers) {
    gameOn = true;
  } else if (boolean === false && numOfPlayerSignedUp === minPlayers) {
    gameOn = true;
  } else {
    gameOn = false;
  }
  return gameOn;
};