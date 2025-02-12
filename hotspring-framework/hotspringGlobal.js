const Sequelize = require('sequelize');
const { Op } = Sequelize;
const path = require('path');

class HotspringGlobal
{
    stacks = {};
    models = {};
    jobs = {};
    routes = {};
    clientPackages = {};

    stackLoadErrors = {};
    sequelize = null;
    configuration = {
        appRoot: path.resolve(__dirname, '../../'),
        coreModulePath: __dirname,
        stackPaths: [],
        publicPaths: [],
        webPort: 3002,
        dbconfig: {
            storage: 'database.sqlite',  // PostgreSQL user
            dialect: 'sqlite',          // Specify PostgreSQL dialect
            logging: true              // Optional: Disable logging SQL queries
          }
    };

    constructor(configuration) {
        this.configuration = { ...this.configuration, ...configuration };
    }

    async initializeDatabase(config) {
        // Implementation for initializing the database
        this.sequelize = new Sequelize(config);

        // Test the connection
        await (async () => {
            try {
                await this.sequelize.authenticate();
                console.log('Connection has been established successfully.');
            } catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        })();
    }

    async manageStacks() {
        // Loop through all the stacks to add ObjectTypes to sequelize if the stack is enabled.
        for (const stackName in global.hotspring.stacks) {
            const stack = global.hotspring.stacks[stackName];
            if (stack.enabled) {
                this.enableStack(stackName);    
            } else {
                this.disableStack(stackName);
            }
        }
        await global.hotspring.sequelize.sync({ alter: true });   
        
        //Seed the Data
        for (const modelName in global.hotspring.models) {
            const model = global.hotspring.models[modelName];
            if (model.seedData) {
            const itemCount = await model.sequelizeObject.count();
            if (itemCount > 0) {
                console.log(model+' already exist, skipping seeding.');
                continue;
            }
            for (const item of model.seedData) {
                await model.sequelizeObject.create(item);
            }
            }
        }
    }

    async enableStack(stackName) {
        const stack = global.hotspring.stacks[stackName];
        stack.enabled = true;
        for (const objectType in stack.objectTypes) {
            stack.objectTypes[objectType].sequelizeDefine(global.hotspring.sequelize, Sequelize.DataTypes);
            global.hotspring.models[stackName+'.'+objectType] = stack.objectTypes[objectType];
        }
        for (const job in stack.jobs) {
            //If this is a service, make sure it is started
            global.hotspring.jobs[stackName+'.'+job] = stack.jobs[job];
        }
        for (const clientPackage in stack.clientPackages) {
            //Is there any initialization code that needs to be run?
            global.hotspring.clientPackages[stackName+'.'+clientPackage] = stack.clientPackages[clientPackage];
        }
        for (const apiRoutes in stack.routes) {
        let thisRoute = stack.routes[apiRoutes];
        if (thisRoute.isAPI) 
            thisRoute.resolvedRoute = '/api/'+stack.name+'/'+thisRoute.path
        else
            thisRoute.resolvedRoute = thisRoute.path;              
        thisRoute.stack=stack.name; //This should probably be when the routes are first fetched.
        thisRoute.loaded=false;

        //Start by creating the routes object for the Operation.
        if (!global.hotspring.routes[thisRoute.method]) global.hotspring.routes[thisRoute.method]={route: null, params:[]};
        
        let curPosition = global.hotspring.routes[thisRoute.method]; // Set our current route to the operation object.
        
        //Break up the route into the parts so we can create the iterative objects
        const routeParts = thisRoute.resolvedRoute.split('/');
        for (let i = 0; i < routeParts.length; i++) {
            const part = routeParts[i];
            if (!part) continue;
            if (part[0]==':') {
            //This is a parameter
            curPosition.params.push(part.substring(1));
            } else {
            //If it isn't a parameter then create and move to the next iteration (as needed)
            if (!curPosition[part]) curPosition[part] = {route: null, params:[]};
            curPosition = curPosition[part];
            curPosition.params=[];
            }
        }
        curPosition.route = thisRoute;
        thisRoute.loaded=true;               
        }
        
        stack.routes=stack.routes;
    }

    async disableStack (stackName) {
        //Code to disable a stack. Do NOT delete data.
    }

    async fetchData(sequelizeObject, filter, sortOrder, page, pageSize) {
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        // Construct the where clause
        const where = filter ? parseSqlLikeWhere(filter) : {};

        // Construct the order clause
        let order = [];
        if (sortOrder) {
            order = sortOrder.split(',').map(order => {
                const [field, direction] = order.trim().split(/\s+/);
                return [field, direction.toUpperCase() || 'ASC'];
            });
        }

        // Construct the options object dynamically
        const options = {
            where,
            order, // Adjust the sort field as needed
        };

        if (limit !== 0) {
            options.offset = offset;
            options.limit = limit;
        }

        const { count, rows } = await sequelizeObject.findAndCountAll(options);

        return { total: count, items: rows };
    }     
};
module.exports = { HotspringGlobal };

// stackPaths: [path.resolve(__dirname, '../../stacks'), //Application Root
//     path.resolve(__dirname, 'stacks_builtin')], //Builtin Files
// publicPaths: [path.resolve(__dirname, '../../public'), //Application Root
//     path.resolve(__dirname, 'public_builtin')] //Builtin Files