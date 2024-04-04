-- drop procedure if exists save_job;

create procedure save_job (@site_job_id varchar (36), @title varchar (255), @company varchar (127), @site varchar (16)) as begin

	declare @id uniqueidentifier;
	declare @source_id uniqueidentifier;

	select @id = id from jobs where site_job_id = @site_job_id;
	select @source_id = id from sources where name = @site;

	if (@id is null) begin
	
		insert into jobs values (
			newid (),
			@site_job_id,
			@source_id,
			@title,
			@company,
			current_timestamp
		);

		select @id = id from jobs where site_job_id = @site_job_id

	end;

	select 
		jobs.id,
		jobs.site_job_id,
		jobs.title,
		jobs.company,
		coalesce (apl.applied, 0)
	from
		jobs
	left join
		applications as apl
	on
		jobs.id = apl.job_id
	where
		(jobs.id = @id);

end;

-- exec save_job @site_job_id = '06A0A504-9490-4700-BA76-D3713CED5D5E', @title = 'Cloud Engineer', @company = 'iTvorks Inc';