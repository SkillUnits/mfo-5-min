import {AlignText} from './constants.js';

export const props = [

  {
    name: 'Movies',
    radius: 0.88,
    itemLabelRadius: 0.92,
    itemLabelRadiusMax: 0.4,
    itemLabelRotation: 0,
    itemLabelAlign: AlignText.right,
    itemLabelBaselineOffset: -0.13,
    itemLabelFont: 'Pragati Narrow',
    itemBackgroundColors: ['#c7160c', '#fff'],
    itemLabelColors: ['#fff', '#000'],
    rotationSpeedMax: 700,
    rotationResistance: -70,
    lineWidth: 0,
    overlayImage: './images/example-2-overlay.svg',
    items: [
      {
        label: 'под 0.01%',
      },
      {
        label: 'Быстрая выдача',
      },
      {
        label: 'Отсрочка 45 дней',
      },
      {
        label: 'Без проверки истории',
      },
      {
        label: 'Без',
      },
      {
        label: 'Без',
      },
      {
        label: 'Без',
      },
      {
        label: 'Без',
      },

    ],
  }
];