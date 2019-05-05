const rp = require('request-promise-native');
const { MINKA_URL } = process.env;


exports.getNewAccessToken = () => {
    const data = "client_id=d42687BAc0cC71F79d9D1bA98DDA9C7D&secret=a27Acb0a4BCE227D25f9Fde49eBb08fEfaecBDda457e9e2D&grant_type=client_credentials"

    const options = {
        uri: `${MINKA_URL}/oauth/token`,
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
        'x-api-key': '2CAF7F7c70c5f63DD9E8cBAa603E668cBDAC0b5B8B08a508eC6ef5f4',
        },
        body: data
    }

    return rp(options)
        .then(res => JSON.parse(res).access_token)
        .catch(err => console.log(err));
}
  
  
exports.verifyAccessToken = (access_token) => {
    const data = "client_id=d42687BAc0cC71F79d9D1bA98DDA9C7D&secret=a27Acb0a4BCE227D25f9Fde49eBb08fEfaecBDda457e9e2D&grant_type=client_credentials"

    const options = {
        uri: `${MINKA_URL}/oauth/tokeninfo?access_token=${access_token}`,
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
        'x-api-key': '2CAF7F7c70c5f63DD9E8cBAa603E668cBDAC0b5B8B08a508eC6ef5f4',
        },
        body: data
    }

    rp(options)
        .then(res => console.log(res))
        .catch(err => console.log(err));
}  
  