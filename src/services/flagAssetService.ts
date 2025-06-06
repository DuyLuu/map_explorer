import { ImageSourcePropType } from 'react-native'

interface FlagAssetCache {
  [countryCode: string]: ImageSourcePropType | undefined
}

interface CountryCodeMap {
  [countryName: string]: string
}

// Cache for resolved flag assets to avoid repeated requires
let flagAssetCache: FlagAssetCache = {}

// Cache for country name to country code mapping
let countryCodeCache: CountryCodeMap = {}

/**
 * Get country code mapping from bundled data
 * This loads the mapping once and caches it
 */
function getCountryCodeMapping(): CountryCodeMap {
  if (Object.keys(countryCodeCache).length > 0) {
    return countryCodeCache
  }

  try {
    const countriesData = require('../data/countries.json')

    countriesData.countries.forEach((country: any) => {
      // Map both the exact name and lowercase name for flexible lookup
      countryCodeCache[country.name] = country.countryCode
      countryCodeCache[country.name.toLowerCase()] = country.countryCode
    })

    console.log(`📋 Loaded country code mapping for ${countriesData.countries.length} countries`)
    return countryCodeCache
  } catch (error) {
    console.error('❌ Failed to load country code mapping:', error)
    return {}
  }
}

/**
 * Get country code for a given country name
 */
export function getCountryCode(countryName: string): string | undefined {
  const mapping = getCountryCodeMapping()

  // Try exact match first
  let code = mapping[countryName]
  if (code) return code

  // Try lowercase match
  code = mapping[countryName.toLowerCase()]
  if (code) return code

  // Generate fallback code from country name if not found
  const fallbackCode = generateFallbackCountryCode(countryName)
  console.warn(`⚠️ Country code not found for "${countryName}", using fallback: ${fallbackCode}`)
  return fallbackCode
}

/**
 * Generate a fallback country code from country name
 */
function generateFallbackCountryCode(countryName: string): string {
  const words = countryName
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(' ')
  if (words.length === 1) {
    return words[0].substring(0, 3)
  } else {
    return words
      .map(word => word[0])
      .join('')
      .substring(0, 3)
  }
}

/**
 * Get local flag asset for a country by country code
 */
export function getFlagAssetByCode(countryCode: string): ImageSourcePropType | undefined {
  const normalizedCode = countryCode.toLowerCase()

  // Return cached asset if available
  if (flagAssetCache[normalizedCode] !== undefined) {
    return flagAssetCache[normalizedCode]
  }

  try {
    // Try to require the flag asset
    const flagAsset = getFlagAssetPath(normalizedCode)
    flagAssetCache[normalizedCode] = flagAsset
    return flagAsset
  } catch (error) {
    console.warn(`⚠️ Flag asset not found for country code: ${countryCode}`)
    flagAssetCache[normalizedCode] = undefined
    return undefined
  }
}

/**
 * Get local flag asset for a country by country name
 */
export function getFlagAssetByName(countryName: string): ImageSourcePropType | undefined {
  const countryCode = getCountryCode(countryName)
  if (!countryCode) {
    console.warn(`⚠️ Cannot find country code for: ${countryName}`)
    return undefined
  }

  return getFlagAssetByCode(countryCode)
}

/**
 * Get flag asset path using require for React Native bundling
 * This function maps country codes to their respective flag assets
 */
function getFlagAssetPath(countryCode: string): ImageSourcePropType {
  const normalizedCode = countryCode.toLowerCase()

  // React Native requires static paths for bundling, so we need to map each flag explicitly
  // This creates a mapping of all possible country codes to their assets
  const flagAssets: { [key: string]: ImageSourcePropType } = {
    ad: require('../data/flags/ad.png'),
    ae: require('../data/flags/ae.png'),
    af: require('../data/flags/af.png'),
    ag: require('../data/flags/ag.png'),
    ai: require('../data/flags/ai.png'),
    al: require('../data/flags/al.png'),
    am: require('../data/flags/am.png'),
    ao: require('../data/flags/ao.png'),
    aq: require('../data/flags/aq.png'),
    ar: require('../data/flags/ar.png'),
    as: require('../data/flags/as.png'),
    at: require('../data/flags/at.png'),
    au: require('../data/flags/au.png'),
    aw: require('../data/flags/aw.png'),
    ax: require('../data/flags/ax.png'),
    az: require('../data/flags/az.png'),
    ba: require('../data/flags/ba.png'),
    bb: require('../data/flags/bb.png'),
    bd: require('../data/flags/bd.png'),
    be: require('../data/flags/be.png'),
    bf: require('../data/flags/bf.png'),
    bg: require('../data/flags/bg.png'),
    bh: require('../data/flags/bh.png'),
    bi: require('../data/flags/bi.png'),
    bj: require('../data/flags/bj.png'),
    bl: require('../data/flags/bl.png'),
    bm: require('../data/flags/bm.png'),
    bn: require('../data/flags/bn.png'),
    bo: require('../data/flags/bo.png'),
    bq: require('../data/flags/bq.png'),
    br: require('../data/flags/br.png'),
    bs: require('../data/flags/bs.png'),
    bt: require('../data/flags/bt.png'),
    bv: require('../data/flags/bv.png'),
    bw: require('../data/flags/bw.png'),
    by: require('../data/flags/by.png'),
    bz: require('../data/flags/bz.png'),
    ca: require('../data/flags/ca.png'),
    cc: require('../data/flags/cc.png'),
    cd: require('../data/flags/cd.png'),
    cf: require('../data/flags/cf.png'),
    cg: require('../data/flags/cg.png'),
    ch: require('../data/flags/ch.png'),
    ci: require('../data/flags/ci.png'),
    ck: require('../data/flags/ck.png'),
    cl: require('../data/flags/cl.png'),
    cm: require('../data/flags/cm.png'),
    cn: require('../data/flags/cn.png'),
    co: require('../data/flags/co.png'),
    cr: require('../data/flags/cr.png'),
    cu: require('../data/flags/cu.png'),
    cv: require('../data/flags/cv.png'),
    cw: require('../data/flags/cw.png'),
    cx: require('../data/flags/cx.png'),
    cy: require('../data/flags/cy.png'),
    cz: require('../data/flags/cz.png'),
    de: require('../data/flags/de.png'),
    dj: require('../data/flags/dj.png'),
    dk: require('../data/flags/dk.png'),
    dm: require('../data/flags/dm.png'),
    do: require('../data/flags/do.png'),
    dz: require('../data/flags/dz.png'),
    ec: require('../data/flags/ec.png'),
    ee: require('../data/flags/ee.png'),
    eg: require('../data/flags/eg.png'),
    eh: require('../data/flags/eh.png'),
    er: require('../data/flags/er.png'),
    es: require('../data/flags/es.png'),
    et: require('../data/flags/et.png'),
    fi: require('../data/flags/fi.png'),
    fj: require('../data/flags/fj.png'),
    fk: require('../data/flags/fk.png'),
    fm: require('../data/flags/fm.png'),
    fo: require('../data/flags/fo.png'),
    fr: require('../data/flags/fr.png'),
    ga: require('../data/flags/ga.png'),
    gb: require('../data/flags/gb.png'),
    gd: require('../data/flags/gd.png'),
    ge: require('../data/flags/ge.png'),
    gf: require('../data/flags/gf.png'),
    gg: require('../data/flags/gg.png'),
    gh: require('../data/flags/gh.png'),
    gi: require('../data/flags/gi.png'),
    gl: require('../data/flags/gl.png'),
    gm: require('../data/flags/gm.png'),
    gn: require('../data/flags/gn.png'),
    gp: require('../data/flags/gp.png'),
    gq: require('../data/flags/gq.png'),
    gr: require('../data/flags/gr.png'),
    gs: require('../data/flags/gs.png'),
    gt: require('../data/flags/gt.png'),
    gu: require('../data/flags/gu.png'),
    gw: require('../data/flags/gw.png'),
    gy: require('../data/flags/gy.png'),
    hk: require('../data/flags/hk.png'),
    hm: require('../data/flags/hm.png'),
    hn: require('../data/flags/hn.png'),
    hr: require('../data/flags/hr.png'),
    ht: require('../data/flags/ht.png'),
    hu: require('../data/flags/hu.png'),
    id: require('../data/flags/id.png'),
    ie: require('../data/flags/ie.png'),
    il: require('../data/flags/il.png'),
    im: require('../data/flags/im.png'),
    in: require('../data/flags/in.png'),
    io: require('../data/flags/io.png'),
    iq: require('../data/flags/iq.png'),
    ir: require('../data/flags/ir.png'),
    is: require('../data/flags/is.png'),
    it: require('../data/flags/it.png'),
    je: require('../data/flags/je.png'),
    jm: require('../data/flags/jm.png'),
    jo: require('../data/flags/jo.png'),
    jp: require('../data/flags/jp.png'),
    ke: require('../data/flags/ke.png'),
    kg: require('../data/flags/kg.png'),
    kh: require('../data/flags/kh.png'),
    ki: require('../data/flags/ki.png'),
    km: require('../data/flags/km.png'),
    kn: require('../data/flags/kn.png'),
    kp: require('../data/flags/kp.png'),
    kr: require('../data/flags/kr.png'),
    kw: require('../data/flags/kw.png'),
    ky: require('../data/flags/ky.png'),
    kz: require('../data/flags/kz.png'),
    la: require('../data/flags/la.png'),
    lb: require('../data/flags/lb.png'),
    lc: require('../data/flags/lc.png'),
    li: require('../data/flags/li.png'),
    lk: require('../data/flags/lk.png'),
    lr: require('../data/flags/lr.png'),
    ls: require('../data/flags/ls.png'),
    lt: require('../data/flags/lt.png'),
    lu: require('../data/flags/lu.png'),
    lv: require('../data/flags/lv.png'),
    ly: require('../data/flags/ly.png'),
    ma: require('../data/flags/ma.png'),
    mc: require('../data/flags/mc.png'),
    md: require('../data/flags/md.png'),
    me: require('../data/flags/me.png'),
    mf: require('../data/flags/mf.png'),
    mg: require('../data/flags/mg.png'),
    mh: require('../data/flags/mh.png'),
    mk: require('../data/flags/mk.png'),
    ml: require('../data/flags/ml.png'),
    mm: require('../data/flags/mm.png'),
    mn: require('../data/flags/mn.png'),
    mo: require('../data/flags/mo.png'),
    mp: require('../data/flags/mp.png'),
    mq: require('../data/flags/mq.png'),
    mr: require('../data/flags/mr.png'),
    ms: require('../data/flags/ms.png'),
    mt: require('../data/flags/mt.png'),
    mu: require('../data/flags/mu.png'),
    mv: require('../data/flags/mv.png'),
    mw: require('../data/flags/mw.png'),
    mx: require('../data/flags/mx.png'),
    my: require('../data/flags/my.png'),
    mz: require('../data/flags/mz.png'),
    na: require('../data/flags/na.png'),
    nc: require('../data/flags/nc.png'),
    ne: require('../data/flags/ne.png'),
    nf: require('../data/flags/nf.png'),
    ng: require('../data/flags/ng.png'),
    ni: require('../data/flags/ni.png'),
    nl: require('../data/flags/nl.png'),
    no: require('../data/flags/no.png'),
    np: require('../data/flags/np.png'),
    nr: require('../data/flags/nr.png'),
    nu: require('../data/flags/nu.png'),
    nz: require('../data/flags/nz.png'),
    om: require('../data/flags/om.png'),
    pa: require('../data/flags/pa.png'),
    pe: require('../data/flags/pe.png'),
    pf: require('../data/flags/pf.png'),
    pg: require('../data/flags/pg.png'),
    ph: require('../data/flags/ph.png'),
    pk: require('../data/flags/pk.png'),
    pl: require('../data/flags/pl.png'),
    pm: require('../data/flags/pm.png'),
    pn: require('../data/flags/pn.png'),
    pr: require('../data/flags/pr.png'),
    ps: require('../data/flags/ps.png'),
    pt: require('../data/flags/pt.png'),
    pw: require('../data/flags/pw.png'),
    py: require('../data/flags/py.png'),
    qa: require('../data/flags/qa.png'),
    re: require('../data/flags/re.png'),
    ro: require('../data/flags/ro.png'),
    rs: require('../data/flags/rs.png'),
    ru: require('../data/flags/ru.png'),
    rw: require('../data/flags/rw.png'),
    sa: require('../data/flags/sa.png'),
    sb: require('../data/flags/sb.png'),
    sc: require('../data/flags/sc.png'),
    sd: require('../data/flags/sd.png'),
    se: require('../data/flags/se.png'),
    sg: require('../data/flags/sg.png'),
    sh: require('../data/flags/sh.png'),
    si: require('../data/flags/si.png'),
    sj: require('../data/flags/sj.png'),
    sk: require('../data/flags/sk.png'),
    sl: require('../data/flags/sl.png'),
    sm: require('../data/flags/sm.png'),
    sn: require('../data/flags/sn.png'),
    so: require('../data/flags/so.png'),
    sr: require('../data/flags/sr.png'),
    ss: require('../data/flags/ss.png'),
    st: require('../data/flags/st.png'),
    sv: require('../data/flags/sv.png'),
    sx: require('../data/flags/sx.png'),
    sy: require('../data/flags/sy.png'),
    sz: require('../data/flags/sz.png'),
    tc: require('../data/flags/tc.png'),
    td: require('../data/flags/td.png'),
    tf: require('../data/flags/tf.png'),
    tg: require('../data/flags/tg.png'),
    th: require('../data/flags/th.png'),
    tj: require('../data/flags/tj.png'),
    tk: require('../data/flags/tk.png'),
    tl: require('../data/flags/tl.png'),
    tm: require('../data/flags/tm.png'),
    tn: require('../data/flags/tn.png'),
    to: require('../data/flags/to.png'),
    tr: require('../data/flags/tr.png'),
    tt: require('../data/flags/tt.png'),
    tv: require('../data/flags/tv.png'),
    tw: require('../data/flags/tw.png'),
    tz: require('../data/flags/tz.png'),
    ua: require('../data/flags/ua.png'),
    ug: require('../data/flags/ug.png'),
    um: require('../data/flags/um.png'),
    us: require('../data/flags/us.png'),
    uy: require('../data/flags/uy.png'),
    uz: require('../data/flags/uz.png'),
    va: require('../data/flags/va.png'),
    vc: require('../data/flags/vc.png'),
    ve: require('../data/flags/ve.png'),
    vg: require('../data/flags/vg.png'),
    vi: require('../data/flags/vi.png'),
    vn: require('../data/flags/vn.png'),
    vu: require('../data/flags/vu.png'),
    wf: require('../data/flags/wf.png'),
    ws: require('../data/flags/ws.png'),
    xk: require('../data/flags/xk.png'),
    ye: require('../data/flags/ye.png'),
    yt: require('../data/flags/yt.png'),
    za: require('../data/flags/za.png'),
    zm: require('../data/flags/zm.png'),
    zw: require('../data/flags/zw.png'),
  }

  const asset = flagAssets[normalizedCode]
  if (!asset) {
    throw new Error(`Flag asset not found for country code: ${normalizedCode}`)
  }

  return asset
}

/**
 * Check if a flag asset exists for a given country code
 */
export function hasFlagAsset(countryCode: string): boolean {
  try {
    getFlagAssetPath(countryCode.toLowerCase())
    return true
  } catch {
    return false
  }
}

/**
 * Get flag asset with fallback handling
 * Returns the flag asset or undefined if not found
 */
export function getFlagAssetWithFallback(countryName: string): ImageSourcePropType | undefined {
  try {
    // Try to get flag by country name
    const asset = getFlagAssetByName(countryName)
    if (asset) return asset

    // If not found, try common name variations
    const variations = getCountryNameVariations(countryName)
    for (const variation of variations) {
      const variantAsset = getFlagAssetByName(variation)
      if (variantAsset) {
        console.log(`✓ Found flag for "${countryName}" using variation: "${variation}"`)
        return variantAsset
      }
    }

    return undefined
  } catch (error) {
    console.warn(`⚠️ Error getting flag asset for "${countryName}":`, error)
    return undefined
  }
}

/**
 * Generate common variations of a country name for fallback matching
 */
function getCountryNameVariations(countryName: string): string[] {
  const variations: string[] = []

  // Add the original name
  variations.push(countryName)

  // Add lowercase version
  variations.push(countryName.toLowerCase())

  // Remove common words and try again
  const withoutCommonWords = countryName
    .replace(/\b(the|of|and|republic|democratic|people's|united|kingdom|states|islands)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (withoutCommonWords !== countryName) {
    variations.push(withoutCommonWords)
    variations.push(withoutCommonWords.toLowerCase())
  }

  return variations
}

/**
 * Clear the flag asset cache (useful for testing or memory management)
 */
export function clearFlagAssetCache(): void {
  flagAssetCache = {}
  countryCodeCache = {}
  console.log('🧹 Flag asset cache cleared')
}

/**
 * Get cache statistics
 */
export function getFlagAssetCacheStats() {
  const cachedAssets = Object.keys(flagAssetCache).length
  const cachedMappings = Object.keys(countryCodeCache).length

  return {
    cachedAssets,
    cachedMappings,
    totalMemoryEntries: cachedAssets + cachedMappings,
  }
}

/**
 * Preload flag assets for better performance (optional)
 * This can be called during app initialization to warm up the cache
 */
export function preloadCommonFlags(): void {
  const commonCountries = [
    'United States',
    'Canada',
    'United Kingdom',
    'France',
    'Germany',
    'Japan',
    'Australia',
    'Brazil',
    'China',
    'India',
    'Russia',
    'Italy',
    'Spain',
  ]

  console.log('🔄 Preloading common flag assets...')

  commonCountries.forEach(countryName => {
    try {
      getFlagAssetByName(countryName)
    } catch (error) {
      // Ignore errors during preloading
    }
  })

  console.log(`✅ Preloaded flags for ${commonCountries.length} common countries`)
}
