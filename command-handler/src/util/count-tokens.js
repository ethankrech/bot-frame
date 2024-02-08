

const regex = /[\s\.,!?:;"'<>\(\)\[\]\{\}\+\-\*\%\/@#\$%\^&\*\(\)_=\|\\\u00a1-\uFFFF]|\w+/g

const countTokens = (string) => {
    let match
    let tokens = 0

    while ((match = regex.exec(string)) !== null) {
        tokens++
    }

    return tokens
}

export default countTokens