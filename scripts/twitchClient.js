import { clientId, clientSecret, userId } from './config.js'

const newFollower = document.querySelector('.new-follower')
const followerName = document.querySelector('#follower-name')
const newFollowerMinLenght = 41

let newFollowers = ['Test']
let followerList = {}

const showFollowerAlert = (userName) => {
    return new Promise(function (resolve) {
        const userNameLenght = userName.length
        newFollower.style.width = `${newFollowerMinLenght + userNameLenght}ch`
        followerName.innerHTML = userName
        newFollower.classList.remove('hide')
        const audio = new Audio('../audio/typingFade.wav')
        setTimeout(() => {
            audio.play()
        }, 900)
        setTimeout(() => {
            audio.pause()
        }, 5300)
        setTimeout(() => {
            resolve()
        }, 8000)
        setTimeout(() => {
            newFollower.classList.add('hide')
        }, 7000)
    })
}

const checkNewFollowers = async () => {
    console.log('checkNewFollowers...', newFollowers)
    if (newFollowers.length > 0) {
        const followers = [...newFollowers]

        for (const follower of followers) {
            await showFollowerAlert(follower)
        }

        newFollowers = newFollowers.filter((x) => {
            return !followers.includes(x)
        })
    }
    setTimeout(() => {
        checkNewFollowers()
    }, 10000)
}

const getToken = async () => {
    const tokenResponse = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        {
            method: 'POST',
        }
    )

    const tokenJson = await tokenResponse.json()
    //console.log(tokenJson.access_token)
    return tokenJson.access_token
}

const getFollower = async (token) => {
    console.log('getting follower...')
    const followerResponse = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${userId}`, {
        headers: {
            Accept: 'application/vnd.twitchtv.v5+json',
            authorization: `Bearer ${token}`,
            'client-id': clientId,
        },
    })
    const followerJson = await followerResponse.json()
    return followerJson
}

const setFollowers = (followers) => {
    followerList = { ...followers }
}

const compareFollower = (newFollowerList) => {
    if (newFollowerList.total <= followerList.total) return
    const newFollowerCounter = newFollowerList.total - followerList.total

    const followers = newFollowerList.data.slice(0, newFollowerCounter)

    followers.forEach((follower) => {
        newFollowers.push(follower.from_name)
    })

    setFollowers(newFollowerList)
    console.log('newFollowers', newFollowers)
}

const updateFollower = async () => {
    const token = await getToken()
    const follower = await getFollower(token)
    console.log('updateFollower', follower)
    console.log('followerList', followerList)
    compareFollower(follower)
    setTimeout(() => {
        updateFollower()
    }, 5000)
}

getToken().then((token) =>
    getFollower(token).then((follower) => {
        setFollowers(follower)
        compareFollower(follower)
        checkNewFollowers()
        setTimeout(() => {
            updateFollower()
        }, 5000)
    })
)
