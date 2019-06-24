const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
  it('returns the date in the correct format when passed a single date in an object', () => {
    inputDate = [{ created_at: 1500584273256 }];
    actual = formatDate(inputDate);
    expected = new Date(1500584273256);
    expect(actual).to.eql(expected);
  });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
