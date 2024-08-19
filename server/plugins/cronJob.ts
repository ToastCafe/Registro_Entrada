import { useScheduler } from "#scheduler";

export default defineNitroPlugin(() => {
  startScheduler();
});

function startScheduler() {
  const scheduler = useScheduler();
  const scheduler2 = useScheduler();
  const scheduler3 = useScheduler();
  scheduler
    .run(async () => {
      try {
        const res = await fetch("/api/mandarExcel", {});
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log("error :C", error);
      }
    })
    .cron("0 0 1 * *");

  scheduler2
    .run(async () => {
      try {
        const res = await fetch("/api/mandarExcel", {});
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log("error :C", error);
      }
    })
    .cron("0 0 15 * *");

  scheduler3
    .run(async () => {
      try {
        //Para que no se apague la base de datos
        const res = await fetch("/api/obtenerEmpleados", {});
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log("error :C", error);
      }
    })
    .everyDays(6);
}
