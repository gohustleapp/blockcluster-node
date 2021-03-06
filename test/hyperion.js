const test = require('ava');
const fs = require('fs');
const path = require('path');

const Config = require('./helpers/config');
const Blockcluster = require('..');

test.before(t => {
  const hyperion = new Blockcluster.Hyperion({
    apiKey: Config.ApiKeys.User,
    domain: Config.Hyperion.domain,
  });

  Object.assign(t.context, { hyperion, hash: '' });
});

test('Upload and Delete Hyperion file', async t => {
  try {
    const { hyperion } = t.context;
    const dest = path.join(__dirname, '..', 'tmp', `README-${new Date().getTime()}.md`);
    fs.writeFileSync(dest, `Hyperion test: ${new Date()}`);

    const stream = fs.createReadStream(dest);

    const hash = await hyperion.uploadFile({ fileStream: stream, locationCode: Config.Hyperion.locationCode });
    fs.unlinkSync(dest);
    await hyperion.deleteFile({ locationCode: Config.Hyperion.locationCode, fileHash: hash });
    t.pass();
  } catch (err) {
    t.fail(err);
  }

  return true;
});

test('Fetch Hyperion file', async t => {
  try {
    const { hyperion } = t.context;
    const writeStream = fs.createWriteStream(path.join(__dirname, '..', 'tmp', 'tmp-1.md'));

    await hyperion.getFile({ locationCode: Config.Hyperion.locationCode, fileHash: Config.fileHash, writeStream });

    t.pass();
  } catch (err) {
    t.fail(err);
  }
});
