create procedure save_job_skill (@job_id uniqueidentifier, @skill_id uniqueidentifier, @id uniqueidentifier output) as begin

	if not exists (select * from job_skills where job_id = @job_id and skill_id = @skill_id) insert into job_skills values (
		newid (),
		@job_id,
		@skill_id
	);

	select @id = id from job_skills where job_id = @job_id and skill_id = @skill_id;

end;