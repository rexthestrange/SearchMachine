drop procedure update_user_skill;

create procedure update_user_skill (@user_id uniqueidentifier, @skill_id uniqueidentifier, @active bit) as begin

	declare @id uniqueidentifier;

	select @id = id from user_skills where 
		(user_id = @user_id) and 
		(skill_id = @skill_id);

	if (@id is null) begin

		insert into user_skills values (
			newid (),
			@user_id,
			@skill_id,
			@active
		);

		select @id = id from user_skills where 
			(user_id = @user_id) and 
			(skill_id = @skill_id);

	end else

		update user_skills set active = @active where id = @id;

	select @id as id;

end;

exec update_user_skill @user_id = '89458391-2600-40E8-B622-CEB6406D28B6', @skill_id = '6AD5E89C-AC70-4614-AB9C-0E24579E20F7', @active = true;