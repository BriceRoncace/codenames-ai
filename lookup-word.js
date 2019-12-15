// import response from './m-w-sing.js';

async function lookupWord(word) {
  const json = await getWebServiceData(word);
  return {
    word: word,
    info: getWordInfo(json)
  }
}

async function getWebServiceData(word) {
  const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=6734293e-e490-495a-b44b-d7926a2e5c17`);
  const json = await response.json();
  return json;
}

function getWebServiceDataLocal(word) {
  return response;
}

function getWordInfo(json) {
  const [{def}] = json;
  return def ? json.map(entry => ( {partOfSpeech: entry.fl, definitions: getEntryInfo(entry)})) : [];
}

function getEntryInfo(entry) {
  if (!entry.def) {
    return [{
      definition: '',
      synonyms: [],
      relatedWords: []
    }];
  }

  const {def:[{sseq}]} = entry;

  return sseq.map(it => {
    const [[sense, {dt:[[text, def]], rel_list:relatedWords, syn_list:synonyms} ]] = it;
    return {
      definition: def,
      synonyms: getWdVals(synonyms),
      relatedWords: getWdVals(relatedWords)
    };
  });

  function getWdVals(arr) {
    // arr is [[{wd:'word1', wd: 'word2'}]]
    return arr ?  arr[0].map(obj => obj.wd) : [];
  }
}

export default lookupWord;