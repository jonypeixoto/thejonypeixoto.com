import '@fontsource/anton/400.css';
import '@fontsource-variable/manrope/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/secao.css';
import './styles/legal.css';
import('./components/analytics.jsx').then(({ montaAnalytics }) => montaAnalytics()).catch(() => {});
