export default eventHandler(async () => {
  const dataStorage = useStorage('table-updates')
  return {
    tableUpdates: await dataStorage.getItem('test')
  }
})
