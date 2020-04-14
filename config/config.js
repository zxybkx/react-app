import path from 'path';
import theme from '../src/theme';

export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: {
          loadingComponent: './lib/PageLoading/index',
          webpackChunkName: true,
        },
        dll: {},
        pwa: {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        },
        hd: true,
        routes: {
          exclude: [],
        },
        hardSource: false,
      },
    ],
    [
      'umi-plugin-authorize',
      {
        authorize: [
          {
            guard: ['./routes/PrivateRoute.js'],
            include: /\/.*/,
            exclude: /\/(passport|400|403|500|501)\/.*/,
          },
        ],
      },
    ],
  ],
  //   exportStatic: {},
  theme: {
    'brand-primary': theme.primaryColor,
  },
  //   ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssnano: {
    mergeRules: false,
  },
  targets: {
    android: 5,
    ios: 7,
    chrome: 58,
    ie: 9,
  },
  outputPath: './dist',
  externals: {
    jquery: 'jQuery',
    $: 'jQuery',
    "react": "window.React",
    "react-dom": "window.ReactDOM"
  },
  hash: true,
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  proxy: {
    '/gateway': {
      'target': 'http://gateway',
      'changeOrigin': true,
    }
  },
};
