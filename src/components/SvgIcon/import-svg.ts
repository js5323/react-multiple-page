/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const importAll = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys().forEach(requireContext);
try {
  // @ts-ignore
  importAll(require.context('@/assets/icons', true, /\.svg$/));
} catch (error) {
  console.log(error);
}
