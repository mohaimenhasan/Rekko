exports.healthHandler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        },
        body: JSON.stringify('You have reached the test endpoint. Wallahi Neyah Eh!'),
    };
    return response;
};
