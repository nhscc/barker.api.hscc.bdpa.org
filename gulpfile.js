'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.regenerate = exports.checkEnv = void 0;

var _path = require('path');

var _core = require('@babel/core');

var _gulp = _interopRequireDefault(require('gulp'));

var _gulpTap = _interopRequireDefault(require('gulp-tap'));

var _fancyLog = _interopRequireDefault(require('fancy-log'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const { populateEnv } = require('./src/dev-utils');

const regenTargets = [`config/*.[jt]s`];

const checkEnv = async () => populateEnv();

exports.checkEnv = checkEnv;
checkEnv.description =
  `Throws an error if any expected environment variables are not properly set ` +
  `(see expectedEnvVariables key in package.json)`;

const regenerate = () => {
  populateEnv();
  (0, _fancyLog.default)(`Regenerating targets: "${regenTargets.join('" "')}"`);
  process.env.BABEL_ENV = 'generator';
  return _gulp.default
    .src(regenTargets)
    .pipe(
      (0, _gulpTap.default)((file) => {
        var _babel;

        file.contents =
          file.contents &&
          Buffer.from(
            ((_babel = (0, _core.transformSync)(file.contents.toString('utf8'), {
              filename: file.path,
              sourceFileName: (0, _path.relative)(__dirname, file.path)
            })) === null || _babel === void 0
              ? void 0
              : _babel.code) || ''
          );
        const name = (0, _path.basename)(file.basename, '.ts');
        file.basename = name == file.basename ? name : `${name}.js`;
      })
    )
    .pipe(_gulp.default.dest('.'));
};

exports.regenerate = regenerate;
regenerate.description =
  'Invokes babel on the files in config, transpiling them into their project root versions';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy9ndWxwZmlsZS50cyJdLCJuYW1lcyI6WyJwb3B1bGF0ZUVudiIsInJlcXVpcmUiLCJyZWdlblRhcmdldHMiLCJjaGVja0VudiIsImRlc2NyaXB0aW9uIiwicmVnZW5lcmF0ZSIsImpvaW4iLCJwcm9jZXNzIiwiZW52IiwiQkFCRUxfRU5WIiwiZ3VscCIsInNyYyIsInBpcGUiLCJmaWxlIiwiY29udGVudHMiLCJCdWZmZXIiLCJmcm9tIiwidG9TdHJpbmciLCJmaWxlbmFtZSIsInBhdGgiLCJzb3VyY2VGaWxlTmFtZSIsIl9fZGlybmFtZSIsImNvZGUiLCJuYW1lIiwiYmFzZW5hbWUiLCJkZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBT0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFLQSxNQUFNO0FBQUVBLEVBQUFBO0FBQUYsSUFBa0JDLE9BQU8sQ0FBQyxpQkFBRCxDQUEvQjs7QUFFQSxNQUFNQyxZQUFZLEdBQUcsQ0FDaEIsZ0JBRGdCLENBQXJCOztBQU1PLE1BQU1DLFFBQVEsR0FBRyxZQUFZSCxXQUFXLEVBQXhDOzs7QUFFUEcsUUFBUSxDQUFDQyxXQUFULEdBQXdCLDZFQUFELEdBQ2hCLGdEQURQOztBQVNPLE1BQU1DLFVBQVUsR0FBRyxNQUFNO0FBQzVCTCxFQUFBQSxXQUFXO0FBRVgseUJBQUssMEJBQXlCRSxZQUFZLENBQUNJLElBQWIsQ0FBa0IsS0FBbEIsQ0FBeUIsR0FBdkQ7QUFFQUMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFNBQVosR0FBd0IsV0FBeEI7QUFFQSxTQUFPQyxjQUFLQyxHQUFMLENBQVNULFlBQVQsRUFDRlUsSUFERSxDQUNHLHNCQUFJQyxJQUFJLElBQUk7QUFBQTs7QUFDZEEsSUFBQUEsSUFBSSxDQUFDQyxRQUFMLEdBQWdCRCxJQUFJLENBQUNDLFFBQUwsSUFBaUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFNSCxJQUFJLENBQUNDLFFBQUwsQ0FBY0csUUFBZCxDQUF1QixNQUF2QixDQUFOLEVBQXNDO0FBQy9FQyxNQUFBQSxRQUFRLEVBQUVMLElBQUksQ0FBQ00sSUFEZ0U7QUFFL0VDLE1BQUFBLGNBQWMsRUFBRSxvQkFBSUMsU0FBSixFQUFlUixJQUFJLENBQUNNLElBQXBCO0FBRitELEtBQXRDLG1EQUd6Q0csSUFIeUMsS0FHakMsRUFIcUIsQ0FBakM7QUFLQSxVQUFNQyxJQUFJLEdBQUcsb0JBQVNWLElBQUksQ0FBQ1csUUFBZCxFQUF3QixLQUF4QixDQUFiO0FBQ0FYLElBQUFBLElBQUksQ0FBQ1csUUFBTCxHQUFnQkQsSUFBSSxJQUFJVixJQUFJLENBQUNXLFFBQWIsR0FBd0JELElBQXhCLEdBQWdDLEdBQUVBLElBQUssS0FBdkQ7QUFDSCxHQVJLLENBREgsRUFVRlgsSUFWRSxDQVVHRixjQUFLZSxJQUFMLENBQVUsR0FBVixDQVZILENBQVA7QUFXSCxDQWxCTTs7O0FBb0JQcEIsVUFBVSxDQUFDRCxXQUFYLEdBQXlCLHlGQUF6QiIsInNvdXJjZXNDb250ZW50IjpbIi8vID8gVG8gcmVnZW5lcmF0ZSB0aGlzIGZpbGUgKGkuZS4gaWYgeW91IGNoYW5nZWQgaXQgYW5kIHdhbnQgeW91ciBjaGFuZ2VzIHRvXG4vLyA/IGJlIHBlcm1hbmVudCksIGNhbGwgYG5wbSBydW4gcmVnZW5lcmF0ZWAgYWZ0ZXJ3YXJkc1xuXG4vLyAhIEJlIHN1cmUgdGhhdCB0YXNrcyBleHBlY3RlZCB0byBydW4gb24gbnBtIGluc3RhbGwgKG1hcmtlZCBAZGVwZW5kZW50KSBoYXZlXG4vLyAhIGFsbCByZXF1aXJlZCBwYWNrYWdlcyBsaXN0ZWQgdW5kZXIgXCJkZXBlbmRlbmNpZXNcIiBpbnN0ZWFkIG9mXG4vLyAhIFwiZGV2RGVwZW5kZW5jaWVzXCIgaW4gdGhpcyBwcm9qZWN0J3MgcGFja2FnZS5qc29uXG5cbmltcG9ydCB7IHJlbGF0aXZlIGFzIHJlbCwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgdHJhbnNmb3JtU3luYyBhcyBiYWJlbCB9IGZyb20gJ0BiYWJlbC9jb3JlJ1xuaW1wb3J0IGd1bHAgZnJvbSAnZ3VscCdcbmltcG9ydCB0YXAgZnJvbSAnZ3VscC10YXAnXG5pbXBvcnQgbG9nIGZyb20gJ2ZhbmN5LWxvZydcblxuLy8gPyBOb3QgdXNpbmcgRVM2L1RTIGltcG9ydCBzeW50YXggaGVyZSBiZWNhdXNlIGRldi11dGlscyBoYXMgc3BlY2lhbFxuLy8gPyBjaXJjdW1zdGFuY2VzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWQsIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbmNvbnN0IHsgcG9wdWxhdGVFbnYgfSA9IHJlcXVpcmUoJy4vc3JjL2Rldi11dGlscycpO1xuXG5jb25zdCByZWdlblRhcmdldHMgPSBbXG4gICAgYGNvbmZpZy8qLltqdF1zYFxuXTtcblxuLy8gKiBDSEVDS0VOVlxuXG5leHBvcnQgY29uc3QgY2hlY2tFbnYgPSBhc3luYyAoKSA9PiBwb3B1bGF0ZUVudigpO1xuXG5jaGVja0Vudi5kZXNjcmlwdGlvbiA9IGBUaHJvd3MgYW4gZXJyb3IgaWYgYW55IGV4cGVjdGVkIGVudmlyb25tZW50IHZhcmlhYmxlcyBhcmUgbm90IHByb3Blcmx5IHNldCBgXG4gICAgKyBgKHNlZSBleHBlY3RlZEVudlZhcmlhYmxlcyBrZXkgaW4gcGFja2FnZS5qc29uKWA7XG5cbi8vICogUkVHRU5FUkFURVxuXG4vLyA/IElmIHlvdSBjaGFuZ2UgdGhpcyBmdW5jdGlvbiwgcnVuIGBucG0gcnVuIHJlZ2VuZXJhdGVgIHR3aWNlOiBvbmNlIHRvXG4vLyA/IGNvbXBpbGUgdGhpcyBuZXcgZnVuY3Rpb24gYW5kIG9uY2UgYWdhaW4gdG8gY29tcGlsZSBpdHNlbGYgd2l0aCB0aGUgbmV3bHlcbi8vID8gY29tcGlsZWQgbG9naWMuIElmIHRoZXJlIGlzIGFuIGVycm9yIHRoYXQgcHJldmVudHMgcmVnZW5lcmF0aW9uLCB5b3UgY2FuXG4vLyA/IHJ1biBgbnBtIHJ1biBnZW5lcmF0ZWAgdGhlbiBgbnBtIHJ1biByZWdlbmVyYXRlYCBpbnN0ZWFkLlxuZXhwb3J0IGNvbnN0IHJlZ2VuZXJhdGUgPSAoKSA9PiB7XG4gICAgcG9wdWxhdGVFbnYoKTtcblxuICAgIGxvZyhgUmVnZW5lcmF0aW5nIHRhcmdldHM6IFwiJHtyZWdlblRhcmdldHMuam9pbignXCIgXCInKX1cImApO1xuXG4gICAgcHJvY2Vzcy5lbnYuQkFCRUxfRU5WID0gJ2dlbmVyYXRvcic7XG5cbiAgICByZXR1cm4gZ3VscC5zcmMocmVnZW5UYXJnZXRzKVxuICAgICAgICAucGlwZSh0YXAoZmlsZSA9PiB7XG4gICAgICAgICAgICBmaWxlLmNvbnRlbnRzID0gZmlsZS5jb250ZW50cyAmJiBCdWZmZXIuZnJvbShiYWJlbChmaWxlLmNvbnRlbnRzLnRvU3RyaW5nKCd1dGY4JyksIHtcbiAgICAgICAgICAgICAgICBmaWxlbmFtZTogZmlsZS5wYXRoLFxuICAgICAgICAgICAgICAgIHNvdXJjZUZpbGVOYW1lOiByZWwoX19kaXJuYW1lLCBmaWxlLnBhdGgpXG4gICAgICAgICAgICB9KT8uY29kZSB8fCAnJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBiYXNlbmFtZShmaWxlLmJhc2VuYW1lLCAnLnRzJyk7XG4gICAgICAgICAgICBmaWxlLmJhc2VuYW1lID0gbmFtZSA9PSBmaWxlLmJhc2VuYW1lID8gbmFtZSA6IGAke25hbWV9LmpzYDtcbiAgICAgICAgfSkpXG4gICAgICAgIC5waXBlKGd1bHAuZGVzdCgnLicpKTtcbn07XG5cbnJlZ2VuZXJhdGUuZGVzY3JpcHRpb24gPSAnSW52b2tlcyBiYWJlbCBvbiB0aGUgZmlsZXMgaW4gY29uZmlnLCB0cmFuc3BpbGluZyB0aGVtIGludG8gdGhlaXIgcHJvamVjdCByb290IHZlcnNpb25zJztcbiJdfQ==
