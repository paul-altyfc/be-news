const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
  it('returns the date in the correct format when passed a single date in an object within an array', () => {
    inputDate = [{ created_at: 1500584273256 }];
    actual = formatDate(inputDate);
    expected = [{ created_at: new Date(1500584273256) }];
    expect(actual).to.eql(expected);
  });
  it('returns an array of dates in the correct format when passed an array containing multiple', () => {
    inputDate = [{ created_at: 1500584273256 }, { created_at: 1500659650346 }];
    actual = formatDate(inputDate);
    expected = [
      { created_at: new Date(1500584273256) },
      { created_at: new Date(1500659650346) }
    ];
    expect(actual).to.eql(expected);
  });
  it('returns an array of with the created_at field in the correct date format when passed an array containing multiple objects', () => {
    input = [
      {
        title: '22 Amazing open source React projects',
        topic: 'coding',
        author: 'happyamy2016',
        body:
          'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
        created_at: 1500659650346
      },
      {
        title: 'Making sense of Redux',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).',
        created_at: 1514093931240
      }
    ];
    actual = formatDate(input);
    expected = [
      {
        title: '22 Amazing open source React projects',
        topic: 'coding',
        author: 'happyamy2016',
        body:
          'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
        created_at: new Date(1500659650346)
      },
      {
        title: 'Making sense of Redux',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).',
        created_at: new Date(1514093931240)
      }
    ];
    expect(actual).to.eql(expected);
  });
});

describe('makeRefObj', () => {
  it('creates a new object when passed an object', () => {
    const input = [];
    const actual = makeRefObj(input);
    expect(actual).to.be.an('object');
  });
  it('returns a key value pair of title and article_id when passed an array containing a single title and article_id', () => {
    const input = [{ article_id: 36, title: 'The vegan carnivore?' }];
    const actual = makeRefObj(input);
    expect(actual['The vegan carnivore?']).to.equal(36);
  });
  it('returns a key value pair of title and article_id when passed an array containing a multiple titles and article_ids', () => {
    const input = [
      { article_id: 36, title: 'The vegan carnivore?' },
      { article_id: 33, title: 'Seafood substitutions are increasing' }
    ];
    const actual = makeRefObj(input);
    expect(actual['The vegan carnivore?']).to.equal(36);
    expect(actual['Seafood substitutions are increasing']).to.equal(33);
  });
});

describe('formatComments', () => {});
