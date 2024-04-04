create procedure get_application (@id uniqueidentifier, @active bit) as begin

	select 
		jobs.id,
		jobs.site_job_id,
		jobs.title,
		jobs.company,
		apl.applied
	from
		jobs
	left join
		applications as apl
	on
		jobs.id = apl.job_id
	where
		(jobs.id = @id) and
		(
			((@active = 0) and (apl.applied is null))  or
			((@active = 1) and (apl.applied is not null))
		);

end;