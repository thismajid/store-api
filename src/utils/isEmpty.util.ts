export default function isEmpty(obj: any) {
  for (const property in obj) {
    return false;
  }
  return true;
}
