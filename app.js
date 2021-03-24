const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const http = require('http');
const expressJWT = require('express-jwt');
const path = require('path');
const app = express();
const jwt = require('json-web-token');

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(
  expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ['sha1', 'RS256'],
    credentialsRequired: false,
  }).unless({
    path: ['/api/auth/login'],
  }),
  (err, req, res, next) => {
    console.log(err);
    next();
  }
);

// load routes and register routes
const authRoutes = require('./server/routes/auth.routes');
app.use('/api/', authRoutes);
const loginRoutes = require('./server/routes/login.routes');
const { isEmpty } = require('./server/lib/helpers');
app.use('/api/', loginRoutes);
const bankRoutes = require('./server/routes/bank.routes');
app.use('/api/', bankRoutes);
const departmentRoutes = require('./server/routes/department.routes');
app.use('/api/', departmentRoutes);
const miscRoutes = require('./server/routes/miscellanous.routes');
app.use('/api/', miscRoutes);
const salaryStructureRoutes = require('./server/routes/salary_structure.routes');
app.use('/api/', salaryStructureRoutes);
const pensioneerRoutes = require('./server/routes/pensioneer.routes');
app.use('/api/', pensioneerRoutes);
const paymentRoutes = require('./server/routes/payment.routes');
app.use('/api/', paymentRoutes);
const newsRoutes = require('./server/routes/news.routes');
app.use('/api/', newsRoutes);
const usersRoutes = require('./server/routes/user.routes');
app.use('/api/', usersRoutes);
const complaintRoutes = require('./server/routes/complaint.routes');
app.use('/api/', complaintRoutes);
const indexRoutes = require('./server/routes/index.routes');
app.use('/api/', indexRoutes);

app.all('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server API listening on port::${PORT}`));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';