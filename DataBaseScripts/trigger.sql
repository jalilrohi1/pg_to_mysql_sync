-- Trigger: trigger_notify_data_change

-- DROP TRIGGER IF EXISTS trigger_notify_data_change ON public.pg_testtb;

CREATE OR REPLACE TRIGGER trigger_notify_data_change
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.pg_testtb
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_data_change();