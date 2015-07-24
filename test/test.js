var conf =  require('./conf.json')
    , gulpdinamico = require('../lib')(conf);

gulpdinamico.build();
