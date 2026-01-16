export interface ExtractedJob {
  title?: string;
  company?: string;
  location?: string;
  url?: string;
  salary_range?: string;
  source?: string;
}

export function parseJobEmail(text: string): ExtractedJob {
  const result: ExtractedJob = {
    source: "email",
  };

  const cleanedText = text.replace(/\n+/g, " ").trim();

  const titlePatterns = [
    /(?:Senior|Lead|Principal|Staff|Junior|Head|VP|Chief)\s+(?:Product|UX|UI|Engineering|Tech|Software|Full\s*Stack|Frontend|Backend|Data)\s+(?:Manager|Designer|Engineer|Lead|Owner|Director|Developer|Specialist|Architect)/i,
    /(?:Product|UX|UX\/UI|Product)\s+(?:Manager|Designer|Lead|Owner|Director)/i,
    /(?:Senior|Lead|Principal|Staff)\s+(?!Role)(?!job)\s*([A-Z][a-zA-Z\s&]+?)(?:\s*[-–|]|\s*(?:role|position|job|opportunity)|$)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = cleanedText.match(pattern);
    if (match) {
      result.title = match[0].trim();
      break;
    }
  }

  const companyPatterns = [
    /(?:at|@|joining|joining\s+the\s+team\s+at)\s+([A-Z][a-zA-Z\s&'’-]{2,30}?)(?:\s*[-–|]|\s*(?:role|position|job|looking|seeking|hiring)|$)/i,
    /(?:role|position|opportunity)\s+(?:at|with|for)\s+([A-Z][a-zA-Z\s&'’-]{2,30}?)(?:\.|,|\s*[-–]|$)/,
    /([A-Z][a-zA-Z\s&'’-]{2,30})\s+(?:is|are)\s+(?:hiring|looking|seeking|recruiting|building|growing|expanding)/i,
  ];

  for (const pattern of companyPatterns) {
    const match = cleanedText.match(pattern);
    if (match) {
      result.company = match[1].trim();
      break;
    }
  }

  const locationPatterns = [
    /(?:based|located|located\s+in|location[:\s]*)\s*(?:in|at|near)?\s*([A-Z][a-zA-Z\s,.-]+?)(?:\.|,|\s*[-–]|remote|hybrid|on-site|onsite|$)/i,
    /(?:remote|hybrid|on-site|onsite|fully\s*remote|partially\s*remote)/i,
    /(?:London|New\s+York|San\s+Francisco|Berlin|Paris|Amsterdam|Tokyo|Singapore|Hong\s+Kong|Dublin|Stockholm|Barcelona|Madrid|Rome|Munich|Zurich|Vienna|Brussels|Copenhagen|Oslo|Helsinki|Warsaw|Prague|Budapest|Bucharest|Athens|Lisbon|Porto|Milan|Rome|Naples|Florence|Venice|Manchester|Birmingham|Leeds|Edinburgh|Glasgow|Bristol|Liverpool|Sheffield|Newcastle|Belfast|Cardiff|Nottingham|Leicester|Brighton|Oxford|Cambridge|Bath|Canterbury|York|Chester|Exeter|Plymouth|Southampton|Portsmouth|Bournemouth|Bournemouth|Reading|Slough|Maidstone|Guildford|Woking|Stoke|Derby|Nottingham|Lincoln|Norwich|Ipswich|Chelmsford|Colchester|Southend|Luton|Milton\s+Keynes|Northampton|Bedford|Peterborough|Huntingdon|Cambridge|St\s+Albans|Watford|Harrow|Uxbridge|Ruislip|Hounslow|Twickenham|Richmond|Kingston|Wimbledon|Croydon|Bromley|Orpington|Sevenoaks|Tunbridge\s+Wells|Maidstone|Ashford|Canterbury|Folkestone|Dover|Margate|Ramsgate|Broadstairs|Whitstable|Herne\s+Bay|Faversham|Rochester|Gillingham|Chatham|Sittingbourne|Sheerness|Queenborough|Isle\s+of\s+Sheppey|Gravesend|Dartford|Sevenoaks|Tunbridge\s+Wells|Maidstone|Ashford|Folkestone|Dover|Margate|Ramsgate|Broadstairs|Whitstable|Herne\s+Bay|Faversham|Rochester|Gillingham|Chatham|Sittingbourne|Sheerness|Queenborough|Isle\s+of\s+Sheppey|Gravesend)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = cleanedText.match(pattern);
    if (match) {
      result.location = match[0].trim();
      break;
    }
  }

  const urlPatterns = [
    /https?:\/\/(?:www\.)?(?:linkedin\.com|indeed\.com|glassdoor\.com|monster\.com|totaljobs\.com|reed\.co\.uk|cwjobs\.co\.uk|jobsite\.co\.uk|cv-library\.co\.uk)[^\s]+/i,
    /(https?:\/\/[^\s]+)/i,
  ];

  for (const pattern of urlPatterns) {
    const match = cleanedText.match(pattern);
    if (match) {
      result.url = match[0];
      break;
    }
  }

  const salaryPatterns = [
    /[£$€]\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\s*(?:k|K|,?\d{3})?(?:\s*[-–to]+\s*[£$€]?\s*\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\s*(?:k|K|,?\d{3})?)/,
    /(?:salary|pay|compensation|remuneration)[:\s]*([£$€]?\s*\d+(?:,\d{3})*(?:\.\d{1,2})?\s*(?:k|K)?(?:\s*[-–to]+\s*[£$€]?\s*\d+(?:,\d{3})*(?:\.\d{1,2})?\s*(?:k|K)?)?)/i,
    /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\s*(?:k|K)?\s*(?:per|\/)\s*(?:year|annum|annually|hour|month|day))\s*(?:GBP|USD|EUR)?/i,
  ];

  for (const pattern of salaryPatterns) {
    const match = cleanedText.match(pattern);
    if (match) {
      result.salary_range = match[0].trim();
      break;
    }
  }

  return result;
}
