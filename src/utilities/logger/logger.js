const winston = require('winston');
require('winston-mongodb');

const { format } = winston;
const { combine, timestamp, label } = format;
const logLevels = {
  error: 0,
  activity: 1,
  authentication: 2
}

  // connect MongoDB
  const DB_USER = "root";
  const DB_PASSWORD = "example";
  const DB_HOST = "mongo"; // name of service in docker-commpose
  const DB_PORT = 27017; // mapping port in mongo service  in docker-compose
  
  // if using docker
 // const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;

    // if using Atlas
    const URI = `mongodb+srv://test_user:example@cluster0.jlyme64.mongodb.net/test?retryWrites=true&w=majority`;
  
const logger = winston.createLogger({
  level: 'info',   // levels and its priorities {error: 0, warn: 1,info: 2,http: 3, verbose: 4, debug: 5,silly: 6 }
  format: winston.format.json(),
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    // new winston.transports.File(
    //     { 
    //         filename: 'error.log',
    //          level: 'error' ,
    //          format:combine(
    //            // label({label: `Modelname`}),
    //             // timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
    //             format.metadata()
    //     )
    //     }
    //     ),
        new winston.transports.MongoDB({
            level: 'info',
            db : URI,
            options: {useUnifiedTopology: true},
            collection: 'activity-log',
         //   defaultMeta: { service: 'user-service' },
            format: combine(
               // label({label: `Modelname`}),
               // timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
               format.metadata()
            )})
            ,

            new winston.transports.MongoDB({
                level: 'error',
                db : URI,
                options: {useUnifiedTopology: true},
                collection: 'error-log',
               // defaultMeta: { service: 'user-service' },
                format: combine(
                   // label({label: `Modelname`}),
                  //  timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                   format.metadata()
                )})
                ,
                new winston.transports.MongoDB({
                    level: 'warn',
                    db : URI,
                    options: {useUnifiedTopology: true},
                    collection: 'auth-log',
                   // defaultMeta: { service: 'user-service' },
                    format: combine(
                        label({label: `Modelname`}),
                       // timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                       format.metadata()
                )})
                    ,
   // new winston.transports.Console(),
  ],
});

module.exports=logger;
