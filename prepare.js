// eslint-disable-next-line node/no-unpublished-require
const husky = require('husky');

if (process.env.HUSKY !== 0) {
    husky.install();
}
