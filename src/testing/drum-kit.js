export default {
  nodeEditor: {
    zoom: '0.49599999999999994',
    'pan-x': '-1165.1392989634664',
    'pan-y': '-2698.431208495636',
  },
  nodes: [
    {
      name: 'node-track',
      x: -1003.1595382890781,
      y: 17.526804905206035,
      attributes: {
        track: '1',
      },
      outputs: ['output-1'],
      inputs: [],
    },
    {
      name: 'node-schedule',
      x: -729,
      y: -541,
      attributes: {
        'start-time': '0.003',
        'time-constant': '0.06',
      },
      outputs: ['output-2'],
      inputs: ['input-1'],
    },
    {
      name: 'node-schedule',
      x: -727,
      y: -90,
      attributes: {
        'start-time': '0',
        'time-constant': '0.001',
        'target-value': '1',
      },
      outputs: ['output-3'],
      inputs: ['input-2'],
    },
    {
      name: 'node-constant',
      x: -372.60414325481185,
      y: -379.75106318595414,
      attributes: {
        offset: '0',
      },
      outputs: ['output-4'],
      inputs: ['input-3'],
    },
    {
      name: 'node-gain',
      x: 12.103986495540756,
      y: -216.77428701187904,
      attributes: {
        gain: '130',
      },
      outputs: ['output-5'],
      inputs: ['input-4', 'input-5'],
    },
    {
      name: 'node-oscillator',
      x: 356.65354866465316,
      y: -265.22661408843317,
      attributes: {
        type: 'sine',
        frequency: '0',
        detune: '0',
      },
      outputs: ['output-6'],
      inputs: ['input-6', 'input-7'],
    },
    {
      name: 'node-biquad-filter',
      x: 726.9356424947939,
      y: -371.6694446525491,
      attributes: {
        type: 'lowpass',
        frequency: '300',
        detune: '0',
        q: '20',
        gain: '0',
      },
      outputs: ['output-7'],
      inputs: ['input-8', 'input-9', 'input-10', 'input-11', 'input-12'],
    },
    {
      name: 'node-gain',
      x: 1095.6431254879901,
      y: -84.59461472057603,
      attributes: {
        gain: '0.8',
      },
      outputs: ['output-8'],
      inputs: ['input-13', 'input-14'],
    },
    {
      name: 'node-gain',
      x: 1595.5793906250203,
      y: -678.7856372098778,
      attributes: {
        gain: '0',
      },
      outputs: ['output-9'],
      inputs: ['input-15', 'input-16'],
    },
    {
      name: 'node-audio-destination',
      x: 3020.777785381184,
      y: 2092.9623023465315,
      attributes: {},
      outputs: [],
      inputs: ['input-17'],
    },
    {
      name: 'node-schedule',
      x: -725.8203497615269,
      y: 368.37996820349827,
      attributes: {
        'start-time': '0.003',
        'time-constant': '0.001',
      },
      outputs: ['output-10'],
      inputs: ['input-18'],
    },
    {
      name: 'node-constant',
      x: -367.8346678971009,
      y: 78.11857115426857,
      attributes: {
        offset: '0',
      },
      outputs: ['output-11'],
      inputs: ['input-19'],
    },
    {
      name: 'node-oscillator',
      x: -725.6398685940358,
      y: 827.3642422564245,
      attributes: {
        type: 'triangle',
        frequency: '66',
        detune: '0',
      },
      outputs: ['output-12'],
      inputs: ['input-20', 'input-21'],
    },
    {
      name: 'node-gain',
      x: -363.9760363944888,
      y: 828.0161696940673,
      attributes: {
        gain: '500',
      },
      outputs: ['output-13'],
      inputs: ['input-22', 'input-23'],
    },
    {
      name: 'node-oscillator',
      x: 8.813079251769526,
      y: 785.8392989457668,
      attributes: {
        type: 'triangle',
        frequency: '40',
        detune: '0',
      },
      outputs: ['output-14'],
      inputs: ['input-24', 'input-25'],
    },
    {
      name: 'node-biquad-filter',
      x: 363.19496449168616,
      y: 561.4241560483201,
      attributes: {
        type: 'highpass',
        frequency: '40',
        detune: '0',
        q: '30',
        gain: '0',
      },
      outputs: ['output-15'],
      inputs: ['input-26', 'input-27', 'input-28', 'input-29', 'input-30'],
    },
    {
      name: 'node-biquad-filter',
      x: 728.4019181546178,
      y: 235.36867851460656,
      attributes: {
        type: 'lowpass',
        frequency: '41',
        detune: '0',
        q: '30',
        gain: '0',
      },
      outputs: ['output-16'],
      inputs: ['input-31', 'input-32', 'input-33', 'input-34', 'input-35'],
    },
    {
      name: 'node-gain',
      x: 365.4764205131359,
      y: 237.77116753357572,
      attributes: {
        gain: '5000',
      },
      outputs: ['output-17'],
      inputs: ['input-36', 'input-37'],
    },
    {
      name: 'node-gain',
      x: 1095.6431254879903,
      y: 240.9185817603625,
      attributes: {
        gain: '0.01',
      },
      outputs: ['output-18'],
      inputs: ['input-38', 'input-39'],
    },
    {
      name: 'node-track',
      x: -1054.4730842157014,
      y: 2456.7491968947447,
      attributes: {
        track: '2',
      },
      outputs: ['output-19'],
      inputs: [],
    },
    {
      name: 'node-schedule',
      x: -710.3152819688562,
      y: 1421.4863902077468,
      attributes: {
        'start-time': '0.003',
        'time-constant': '0.03',
      },
      outputs: ['output-20'],
      inputs: ['input-40'],
    },
    {
      name: 'node-schedule',
      x: -712.0423976856096,
      y: 1892.9889808813205,
      attributes: {
        'start-time': '0.003',
        'time-constant': '0.04',
      },
      outputs: ['output-21'],
      inputs: ['input-41'],
    },
    {
      name: 'node-schedule',
      x: -710.6890333515671,
      y: 2361.375921217777,
      attributes: {
        'start-time': '0',
        'time-constant': '0.001',
        'target-value': '1',
      },
      outputs: ['output-22'],
      inputs: ['input-42'],
    },
    {
      name: 'node-schedule',
      x: -712.0423976856096,
      y: 2822.177236494451,
      attributes: {
        'start-time': '0.003',
        'time-constant': '0.08',
      },
      outputs: ['output-23'],
      inputs: ['input-43'],
    },
    {
      name: 'node-schedule',
      x: -713.769513402362,
      y: 3293.679827168025,
      attributes: {
        'start-time': '0.003',
        'time-constant': '0.06',
      },
      outputs: ['output-24'],
      inputs: ['input-44'],
    },
    {
      name: 'node-oscillator',
      x: -355.0348767127921,
      y: 1587.9284816870131,
      attributes: {
        type: 'triangle',
        frequency: '305',
        detune: '0',
      },
      outputs: ['output-25'],
      inputs: ['input-45', 'input-46'],
    },
    {
      name: 'node-oscillator',
      x: 31.199716869938584,
      y: 2233.2254192353807,
      attributes: {
        type: 'triangle',
        frequency: '195',
        detune: '0',
      },
      outputs: ['output-26'],
      inputs: ['input-47', 'input-48'],
    },
    {
      name: 'node-gain',
      x: 393.60992999012706,
      y: 1525.7675439180234,
      attributes: {
        gain: '0',
      },
      outputs: ['output-27'],
      inputs: ['input-49', 'input-50'],
    },
    {
      name: 'node-gain',
      x: 402.72053054731487,
      y: 1902.751489503794,
      attributes: {
        gain: '0',
      },
      outputs: ['output-28'],
      inputs: ['input-51', 'input-52'],
    },
    {
      name: 'node-gain',
      x: 1061.6605293744233,
      y: 2056.2210485154756,
      attributes: {
        gain: '0.4',
      },
      outputs: ['output-29'],
      inputs: ['input-53', 'input-54'],
    },
    {
      name: 'node-white-noise',
      x: -666.90731963802,
      y: 3773.783484218561,
      attributes: {},
      outputs: ['output-30'],
      inputs: [],
    },
    {
      name: 'node-biquad-filter',
      x: -299.372509577875,
      y: 3402.6133298597133,
      attributes: {
        type: 'lowpass',
        frequency: '7000',
        detune: '0',
        q: '1',
        gain: '0',
      },
      outputs: ['output-31'],
      inputs: ['input-55', 'input-56', 'input-57', 'input-58', 'input-59'],
    },
    {
      name: 'node-gain',
      x: 401.2338398706793,
      y: 2624.501335261665,
      attributes: {
        gain: '0',
      },
      outputs: ['output-32'],
      inputs: ['input-60', 'input-61'],
    },
    {
      name: 'node-gain',
      x: 1065.5215332354273,
      y: 2363.170855465284,
      attributes: {
        gain: '0.1',
      },
      outputs: ['output-33'],
      inputs: ['input-62', 'input-63'],
    },
    {
      name: 'node-biquad-filter',
      x: 176.5945089571619,
      y: 3239.8714203543122,
      attributes: {
        type: 'highpass',
        frequency: '523',
        detune: '0',
        q: '1',
        gain: '0',
      },
      outputs: ['output-34'],
      inputs: ['input-64', 'input-65', 'input-66', 'input-67', 'input-68'],
    },
    {
      name: 'node-gain',
      x: 584.5173045351621,
      y: 2973.0895253697045,
      attributes: {
        gain: '0',
      },
      outputs: ['output-35'],
      inputs: ['input-69', 'input-70'],
    },
    {
      name: 'node-gain',
      x: 2663.168866400935,
      y: 1703.1221220579357,
      attributes: {
        gain: '0.3',
      },
      outputs: ['output-36'],
      inputs: ['input-71', 'input-72'],
    },
    {
      name: 'node-track',
      x: -1276.5200797844159,
      y: 4923.211135919068,
      attributes: {
        track: '3',
      },
      outputs: ['output-37'],
      inputs: [],
    },
    {
      name: 'node-schedule',
      x: -709.3608660788152,
      y: 4231.971690133834,
      attributes: {
        'target-value': '1',
        'time-constant': '0.001',
      },
      outputs: ['output-38'],
      inputs: ['input-73'],
    },
    {
      name: 'node-schedule',
      x: -713.5267616486068,
      y: 5154.08141453968,
      attributes: {
        'target-value': '0',
        'start-time': '0.033',
        'time-constant': '0.03',
      },
      outputs: ['output-39'],
      inputs: ['input-74'],
    },
    {
      name: 'node-gain',
      x: 284.5458457470833,
      y: 4340.298574910537,
      attributes: {
        gain: '0',
      },
      outputs: ['output-40'],
      inputs: ['input-75', 'input-76'],
    },
    {
      name: 'node-gain',
      x: 2669.238195160864,
      y: 2342.426508827067,
      attributes: {
        gain: '1.6',
      },
      outputs: ['output-41'],
      inputs: ['input-77', 'input-78'],
    },
    {
      name: 'node-gain',
      x: 2665.1044755627627,
      y: 2024.8847256455183,
      attributes: {
        gain: '0.5',
      },
      outputs: ['output-42'],
      inputs: ['input-79', 'input-80'],
    },
    {
      name: 'node-track',
      x: -1278.8344735413634,
      y: 5179.559586081911,
      attributes: {
        track: '4',
      },
      outputs: ['output-43'],
      inputs: [],
    },
    {
      name: 'node-schedule',
      x: -714.0021419926916,
      y: 5619.609003511123,
      attributes: {
        'target-value': '0',
        'start-time': '0.033',
        'time-constant': '0.3',
      },
      outputs: ['output-44'],
      inputs: ['input-81'],
    },
    {
      name: 'node-oscillator',
      x: 333.57052014148326,
      y: 5055.428417486846,
      attributes: {
        type: 'square',
        frequency: '0',
        detune: '0',
      },
      outputs: ['output-45'],
      inputs: ['input-82', 'input-83'],
    },
    {
      name: 'node-oscillator',
      x: 335.52364514148337,
      y: 5440.194042486846,
      attributes: {
        type: 'square',
        frequency: '0',
        detune: '0',
      },
      outputs: ['output-46'],
      inputs: ['input-84', 'input-85'],
    },
    {
      name: 'node-oscillator',
      x: 333.57052014148326,
      y: 5824.959667486846,
      attributes: {
        type: 'square',
        frequency: '0',
        detune: '0',
      },
      outputs: ['output-47'],
      inputs: ['input-86', 'input-87'],
    },
    {
      name: 'node-oscillator',
      x: 335.52364514148337,
      y: 6219.490917486846,
      attributes: {
        type: 'square',
        frequency: '0',
        detune: '0',
      },
      outputs: ['output-48'],
      inputs: ['input-88', 'input-89'],
    },
    {
      name: 'node-oscillator',
      x: 337.47677014148337,
      y: 6604.256542486834,
      attributes: {
        type: 'square',
        frequency: '0',
        detune: '0',
      },
      outputs: ['output-49'],
      inputs: ['input-90', 'input-91'],
    },
    {
      name: 'node-oscillator',
      x: 335.52364514148337,
      y: 6989.0221674868335,
      attributes: {
        type: 'square',
        frequency: '0',
        detune: '0',
      },
      outputs: ['output-50'],
      inputs: ['input-92', 'input-93'],
    },
    {
      name: 'node-constant',
      x: -544.114904549169,
      y: 6215.626625730125,
      attributes: {
        offset: '40',
      },
      outputs: ['output-51'],
      inputs: ['input-94'],
    },
    {
      name: 'node-gain',
      x: 0.8630737514010676,
      y: 5094.093700603908,
      attributes: {
        gain: '2',
      },
      outputs: ['output-52'],
      inputs: ['input-95', 'input-96'],
    },
    {
      name: 'node-gain',
      x: -6.033477972736614,
      y: 5482.599447730347,
      attributes: {
        gain: '3.01',
      },
      outputs: ['output-53'],
      inputs: ['input-97', 'input-98'],
    },
    {
      name: 'node-gain',
      x: 0.8630737514022044,
      y: 5871.105194856782,
      attributes: {
        gain: '4.16',
      },
      outputs: ['output-54'],
      inputs: ['input-99', 'input-100'],
    },
    {
      name: 'node-gain',
      x: 0.0391494303771438,
      y: 6255.2268508429515,
      attributes: {
        gain: '5.43',
      },
      outputs: ['output-55'],
      inputs: ['input-101', 'input-102'],
    },
    {
      name: 'node-gain',
      x: 5.938854445126006,
      y: 6650.507086831139,
      attributes: {
        gain: '6.79',
      },
      outputs: ['output-56'],
      inputs: ['input-103', 'input-104'],
    },
    {
      name: 'node-gain',
      x: 10.003895095532453,
      y: 7036.685948619757,
      attributes: {
        gain: '8.21',
      },
      outputs: ['output-57'],
      inputs: ['input-105', 'input-106'],
    },
    {
      name: 'node-biquad-filter',
      x: 1170.7823965319308,
      y: 5745.7833538478535,
      attributes: {
        type: 'bandpass',
        frequency: '10000',
        detune: '0',
        q: '1',
        gain: '0',
      },
      outputs: ['output-58'],
      inputs: ['input-107', 'input-108', 'input-109', 'input-110', 'input-111'],
    },
    {
      name: 'node-schedule',
      x: -713.5267616486066,
      y: 4692.116420208624,
      attributes: {
        'target-value': '0.35',
        'start-time': '0.003',
        'time-constant': '0.01',
      },
      outputs: ['output-59'],
      inputs: ['input-112'],
    },
    {
      name: 'node-biquad-filter',
      x: 1428.3596159152262,
      y: 4788.658668698789,
      attributes: {
        type: 'highpass',
        frequency: '2500',
        detune: '0',
        q: '1',
        gain: '0',
      },
      outputs: ['output-60'],
      inputs: ['input-113', 'input-114', 'input-115', 'input-116', 'input-117'],
    },
    {
      name: 'node-gain',
      x: 803.2299387257294,
      y: 5880.848066547046,
      attributes: {
        gain: '0.16',
      },
      outputs: ['output-61'],
      inputs: ['input-118', 'input-119'],
    },
  ],
  links: [
    {
      from: 'output-1',
      to: 'input-1',
    },
    {
      from: 'output-1',
      to: 'input-2',
    },
    {
      from: 'output-2',
      to: 'input-3',
    },
    {
      from: 'output-3',
      to: 'input-3',
    },
    {
      from: 'output-4',
      to: 'input-5',
    },
    {
      from: 'output-5',
      to: 'input-6',
    },
    {
      from: 'output-6',
      to: 'input-12',
    },
    {
      from: 'output-4',
      to: 'input-15',
    },
    {
      from: 'output-8',
      to: 'input-16',
    },
    {
      from: 'output-1',
      to: 'input-18',
    },
    {
      from: 'output-3',
      to: 'input-19',
    },
    {
      from: 'output-10',
      to: 'input-19',
    },
    {
      from: 'output-12',
      to: 'input-23',
    },
    {
      from: 'output-13',
      to: 'input-24',
    },
    {
      from: 'output-14',
      to: 'input-30',
    },
    {
      from: 'output-15',
      to: 'input-35',
    },
    {
      from: 'output-11',
      to: 'input-37',
    },
    {
      from: 'output-18',
      to: 'input-16',
    },
    {
      from: 'output-16',
      to: 'input-39',
    },
    {
      from: 'output-17',
      to: 'input-31',
    },
    {
      from: 'output-7',
      to: 'input-14',
    },
    {
      from: 'output-19',
      to: 'input-40',
    },
    {
      from: 'output-19',
      to: 'input-41',
    },
    {
      from: 'output-19',
      to: 'input-42',
    },
    {
      from: 'output-19',
      to: 'input-43',
    },
    {
      from: 'output-19',
      to: 'input-44',
    },
    {
      from: 'output-25',
      to: 'input-50',
    },
    {
      from: 'output-20',
      to: 'input-49',
    },
    {
      from: 'output-21',
      to: 'input-51',
    },
    {
      from: 'output-22',
      to: 'input-49',
    },
    {
      from: 'output-22',
      to: 'input-51',
    },
    {
      from: 'output-26',
      to: 'input-52',
    },
    {
      from: 'output-27',
      to: 'input-54',
    },
    {
      from: 'output-28',
      to: 'input-54',
    },
    {
      from: 'output-30',
      to: 'input-59',
    },
    {
      from: 'output-31',
      to: 'input-61',
    },
    {
      from: 'output-31',
      to: 'input-68',
    },
    {
      from: 'output-34',
      to: 'input-70',
    },
    {
      from: 'output-24',
      to: 'input-69',
    },
    {
      from: 'output-22',
      to: 'input-69',
    },
    {
      from: 'output-35',
      to: 'input-63',
    },
    {
      from: 'output-32',
      to: 'input-63',
    },
    {
      from: 'output-9',
      to: 'input-72',
    },
    {
      from: 'output-22',
      to: 'input-60',
    },
    {
      from: 'output-23',
      to: 'input-60',
    },
    {
      from: 'output-38',
      to: 'input-75',
    },
    {
      from: 'output-39',
      to: 'input-75',
    },
    {
      from: 'output-29',
      to: 'input-80',
    },
    {
      from: 'output-33',
      to: 'input-80',
    },
    {
      from: 'output-44',
      to: 'input-75',
    },
    {
      from: 'output-51',
      to: 'input-96',
    },
    {
      from: 'output-52',
      to: 'input-82',
    },
    {
      from: 'output-51',
      to: 'input-98',
    },
    {
      from: 'output-53',
      to: 'input-84',
    },
    {
      from: 'output-51',
      to: 'input-100',
    },
    {
      from: 'output-54',
      to: 'input-86',
    },
    {
      from: 'output-55',
      to: 'input-88',
    },
    {
      from: 'output-51',
      to: 'input-102',
    },
    {
      from: 'output-56',
      to: 'input-90',
    },
    {
      from: 'output-51',
      to: 'input-104',
    },
    {
      from: 'output-51',
      to: 'input-106',
    },
    {
      from: 'output-57',
      to: 'input-92',
    },
    {
      from: 'output-58',
      to: 'input-76',
    },
    {
      from: 'output-59',
      to: 'input-75',
    },
    {
      from: 'output-37',
      to: 'input-73',
    },
    {
      from: 'output-37',
      to: 'input-112',
    },
    {
      from: 'output-37',
      to: 'input-74',
    },
    {
      from: 'output-43',
      to: 'input-73',
    },
    {
      from: 'output-43',
      to: 'input-112',
    },
    {
      from: 'output-43',
      to: 'input-81',
    },
    {
      from: 'output-40',
      to: 'input-117',
    },
    {
      from: 'output-60',
      to: 'input-78',
    },
    {
      from: 'output-41',
      to: 'input-17',
    },
    {
      from: 'output-42',
      to: 'input-17',
    },
    {
      from: 'output-36',
      to: 'input-17',
    },
    {
      from: 'output-61',
      to: 'input-111',
    },
    {
      from: 'output-45',
      to: 'input-119',
    },
    {
      from: 'output-46',
      to: 'input-119',
    },
    {
      from: 'output-47',
      to: 'input-119',
    },
    {
      from: 'output-48',
      to: 'input-119',
    },
    {
      from: 'output-49',
      to: 'input-119',
    },
    {
      from: 'output-50',
      to: 'input-119',
    },
  ],
  tracker: {
    tempo: 140,
    lines: 32,
    linesPerBeat: 4,
  },
  tracks: [
    {
      label: '1',
      effects: {
        0: 'FF',
        1: 'FF',
        3: 'FF',
        5: 'FF',
        6: 'FF',
        7: 'FF',
        10: 'FF',
        12: 'FF',
        13: 'FF',
        15: 'FF',
        17: 'FF',
        18: 'FF',
        19: 'FF',
        20: 'FF',
        22: 'FF',
        26: 'FF',
        28: 'FF',
      },
    },
    {
      label: '2',
      effects: {
        8: 'FF',
        24: 'FF',
        29: 'FF',
      },
    },
    {
      label: '3',
      effects: {},
    },
    {
      label: '4',
      effects: {
        0: 'FF',
        4: 'FF',
        8: 'FF',
        12: 'FF',
        16: 'FF',
        20: 'FF',
        24: 'FF',
        28: 'FF',
      },
    },
  ],
  audioFiles: [],
}
