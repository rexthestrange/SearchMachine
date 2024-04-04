create procedure get_user_account_by_id (@Id varchar(36)) as
begin

	select * from
		user_accounts as uac
	where
		uac.Id = @Id;

end;