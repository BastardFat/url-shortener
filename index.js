const express = require('express');
const app = express();


app.use('/', require('./routers'));

app.listen(process.env.PORT || 3000, () => console.log('App started on port 3000'));
