const skinMakers = require('./js/skinMakers.js')
const profile = require('./js/wsManager.js')

var fs = require('fs')

const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile("index.html", {
        root: __dirname
    })
})

app.get('/skin-maker-skins/canvas/*', function (req, res) {

    var creator = (req.path).slice(25)
    console.log(creator)

    var svgData = skinMakers.getFullSvg(skinMakers.setSvg(skinMakers.getSkinsByCreator(creator)))
    fs.writeFile('./public/image.svg', svgData, function (err) {
        if (err) throw err;
    })
    setTimeout(() => {

        res.sendFile("public/image.svg", {
            root: __dirname
        })
    }, 1);

})

app.get('/skin-maker-skins/*', function (req, res) {
    var creator = (req.path).slice(18)
    res.send(skinMakers.getSkinsByCreator(creator))
})

app.get('/profile/*', function (req, res) {
    let username = (req.path).slice(9)
    profile.sendData(['r', 'profile', username]).then((val) => {
        let data = val[3]
        let obj = ""
        if (data !== null) {
            obj = {
                "stats": {
                    "username": data.player_name,
                    "clan": data.player_clan,
                    "verified": (data.player_featured == 1),
                    "id": data.player_id,
                    "kills": data.player_kills,
                    "deaths": data.player_deaths,
                    "wins": data.player_wins,
                    "gamesPlayed": data.player_games_played,
                    "timePlayed": data.player_timeplayed,
                    "kr": data.player_funds,
                    "score": data.player_score,
                    "hacker": (data.player_hack == 1),
                    "following": data.player_following,
                    "followers": data.player_followed,
                    "stats": data.player_stats,
                    "dateJoined": data.player_datenew,
                    "elo1v1": data.player_elo,
                    "elo2v2": data.player_elo2,
                    "elo4v4": data.player_elo4,
                    "challenge": data.player_chal,
                    "infected": (data.player_infected == 1),
                    "premium": (data.player_premium == 1),
                    "eggs": data.player_eventcount
                },
                "mods": val[5],
                "maps": val[4]
            }
        } else {
            obj = "UNKNOWN PLAYER"
        }
        res.send(obj)
    });
})

app.get('/clan/*', function (req, res) {
    let clanName = (req.path).slice(6)
    profile.sendData(['r', 'clan', clanName]).then((val) => {
        console.log(val)
        let data = val[3]
        let obj = {}
        if (data !== null) {
            let obj = {
                "name": data.clan_name,
                "id": data.clan_id,
                "score": data.clan_score,
                "memberCount": data.members.length,
                "members": data.members,
                "creator": data.creatorname
            }
        } else {
            obj = "UNKNOWN CLAN"
        }
        res.send(obj)
    });
})

app.get('/leaders/*', function (req, res) {
    let type = (req.path).slice(9).toLowerCase()
    let array = []
    switch (type) {
        case "":
        case "score":
        case "level":
        case "levels":
            type = "player_score"
            break;
        case "clan":
        case "clans":
            type = "player_clans"
            break;
        case "funds":
        case "kr":
        case "krunkies":
            type = "player_funds"
            break;
        case "time":
            type = "player_timeplayed"
            break;
        case "wins":
            type = "player_wins"
            break;
        case "challenge":
        case "chal":
            type = "player_chal"
            break;
        case "eventcount":
        case "eggs":
            type = "player_eventcount"
            break;
        case "elo":
            type = "player_elo"
            break;
        case "elo2":
            type = "player_elo2"
            break;
        case "elo4":
            type = "player_elo4"
            break;
        case "kills":
            type = "player_kills"
            break;
        default:
            array = "UNKNOWN LEADERBOARD";
            res.send("UNKNOWN LEADERBOARD");
    }
    if (array == "UNKNOWN LEADERBOARD") {
        profile.sendData(['r', 'leaders', type]).then((val) => {
            res.send(array)
        });
    } else {
        res.send(array)
    }
})

app.listen(port, () => console.log(`Krunker api listening at http://localhost:${port}`))