'use strict';

module.exports = {
    countries: `
SELECT DISTINCT ?_id ?_idLabel ?flag ?capitalLabel ?population
(GROUP_CONCAT(distinct ?region; separator = ", ") as ?regions)
(GROUP_CONCAT(distinct ?sibling; separator = ", ") as ?siblings)
(GROUP_CONCAT(distinct ?siblingLabel; separator = ", ") as ?siblingLabels)
WHERE
{
    ?_id wdt:P31 wd:Q6256.
    ?_id wdt:P36 ?capital.
    ?_id wdt:P41 ?flag.
    ?_id wdt:P1082 ?population.
    OPTIONAL { ?_id wdt:P150 ?region.}
    OPTIONAL { ?_id wdt:P47 ?sibling.}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en".
                             ?_id rdfs:label ?_idLabel.
                             ?capital rdfs:label ?capitalLabel.
                             ?sibling rdfs:label ?siblingLabel.

                           }
}
GROUP BY ?_id ?_idLabel ?flag ?capitalLabel ?population
ORDER BY ?_idLabel

    `,
    regions: `
SELECT DISTINCT ?_id ?_idLabel ?capital ?capitalLabel ?flag ?coordinates WHERE {
  ?_id (wdt:P31/wdt:P279*) wd:Q10864048.
  ?_id wdt:P36 ?capital.
  ?_id wdt:P41 ?flag.
  ?_id wdt:P625 ?coordinates
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" .}
}
ORDER BY ?_id
`,
    cities: `
SELECT DISTINCT ?_id ?_idLabel ?countryLabel ?population
(GROUP_CONCAT(distinct ?region; separator = ",") as ?regions)
WHERE {
    ?_id wdt:P31/wdt:P279* wd:Q515 .
    ?_id wdt:P1082 ?population .
    ?_id wdt:P17 ?country .
    ?_id wdt:P131 ?region .
    FILTER(?population > 40000).
    SERVICE wikibase:label {
        bd:serviceParam wikibase:language "en" .
    }
}
GROUP BY ?_id ?_idLabel ?countryLabel ?population
ORDER BY ?_id
`
};