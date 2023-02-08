module.exports = (object) =>{

    const textJson = JSON.stringify(object);
    const parsedData = JSON.parse(textJson);

    return parsedData;
}

